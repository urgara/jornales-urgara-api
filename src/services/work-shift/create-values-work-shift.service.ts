import { Injectable } from '@nestjs/common';
import {
  DatabaseService,
  DateService,
  DecimalService,
} from 'src/services/common';
import {
  CreateBaseValueWorkShifts,
  CreateValueWorkShifts,
  CreateValuesWorkShiftsData,
  WorkShiftTypeEnum,
} from 'src/types/work-shift';
import { DecimalInput, DecimalNumber } from '../../types/common';

@Injectable()
export class CreateValuesWorkShiftService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly dateService: DateService,
    private readonly decimalService: DecimalService,
  ) {}

  jc(number: DecimalInput): DecimalNumber {
    const decimal = this.decimalService.create(number);
    return this.decimalService.multiply(decimal, 0.7);
  }

  async create({
    initialDate,
    portId,
    list,
    values,
    jc,
  }: CreateValuesWorkShiftsData) {
    return await this.databaseService.$transaction(
      async (tx) => {
        // Cerrar los valores antiguos con el día anterior a las 23:59:59
        const previousDayEndDate =
          this.dateService.toPreviousDayEndOfDay(initialDate);
        // Normalizar la fecha inicial a las 00:00:00
        const normalizedStartDate =
          this.dateService.toArgentinaStartOfDay(initialDate);

        await tx.baseValueWorkShift.updateMany({
          where: { portId, endDate: null },
          data: { endDate: previousDayEndDate },
        });

        const baseValuesWorkShifts: CreateBaseValueWorkShifts = [];

        // Procesar valores STANDAR
        for (const elem of values.STANDART) {
          baseValuesWorkShifts.push({
            remuneratedValue: elem.remunerated,
            notRemuneratedValue: elem.notRemunerated,
            categoryId: elem.categoryId,
            portId,
            startDate: normalizedStartDate,
          });
        }

        const createdBaseValues =
          await tx.baseValueWorkShift.createManyAndReturn({
            data: baseValuesWorkShifts,
            include: { Category: true },
          });

        // Crear ValueWorkShifts para cada BaseValueWorkShift
        const valueWorkShifts: CreateValueWorkShifts = [];

        for (const baseValue of createdBaseValues) {
          const isSpecialCategory = baseValue.Category.isSpecial;

          if (isSpecialCategory) {
            // Categoría especial: crear UN SOLO ValueWorkShift con workShiftId = null
            // Esto significa que aplica a todos los turnos
            valueWorkShifts.push({
              workShiftId: null,
              baseValueWorkShiftId: baseValue.id,
              type: WorkShiftTypeEnum.STANDART,
              calculatedRemuneratedValue: baseValue.remuneratedValue,
              calculatedNotRemuneratedValue: baseValue.notRemuneratedValue,
            });
          } else {
            // Categoría normal: crear ValueWorkShift para cada turno específico
            for (const shift of list) {
              // Filtrar por categoryIds si está presente
              if (
                shift.categoryIds &&
                shift.categoryIds.length > 0 &&
                !shift.categoryIds.includes(baseValue.categoryId)
              ) {
                continue; // Saltar esta categoría si no está en categoryIds
              }

              // Calcular valores: valor_base * coeficiente
              const calculatedRemunerated = this.decimalService.multiply(
                baseValue.remuneratedValue,
                shift.coefficient,
              );
              const calculatedNotRemunerated = this.decimalService.multiply(
                baseValue.notRemuneratedValue,
                shift.coefficient,
              );

              // Crear ValueWorkShift STANDART
              valueWorkShifts.push({
                workShiftId: shift.id,
                baseValueWorkShiftId: baseValue.id,
                type: WorkShiftTypeEnum.STANDART,
                calculatedRemuneratedValue: calculatedRemunerated,
                calculatedNotRemuneratedValue: calculatedNotRemunerated,
              });

              // Si jc es true, duplicar con tipo JC al 70%
              if (jc) {
                valueWorkShifts.push({
                  workShiftId: shift.id,
                  baseValueWorkShiftId: baseValue.id,
                  type: WorkShiftTypeEnum.JC,
                  calculatedRemuneratedValue: this.jc(calculatedRemunerated),
                  calculatedNotRemuneratedValue: this.jc(
                    calculatedNotRemunerated,
                  ),
                });
              }
            }
          }
        }

        await tx.valueWorkShift.createMany({
          data: valueWorkShifts,
        });

        return createdBaseValues;
      },
      { timeout: 20000 },
    );
  }
}

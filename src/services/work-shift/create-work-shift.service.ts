import { Injectable } from '@nestjs/common';
import { DatabaseService, UuidService } from '../common';
import type { CreateWorkShift } from 'src/types/work-shift';

@Injectable()
export class CreateWorkShiftService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly uuidService: UuidService,
  ) {}

  async create(workShiftData: CreateWorkShift) {
    const { days, startTime, endTime, description, coefficient } =
      workShiftData;

    const workShiftId = this.uuidService.V6();

    /**
     * Convertir strings de tiempo (HH:mm) a objetos Date para PostgreSQL TIME
     * Usa 1970-01-01 como fecha dummy (epoch Unix) ya que solo se almacena la porción de tiempo
     * La 'Z' indica UTC para evitar conversiones de timezone
     * PostgreSQL @db.Time extrae únicamente horas, minutos y segundos del objeto Date
     */
    const startTimeDate = new Date(`1970-01-01T${startTime}:00Z`);
    const endTimeDate = new Date(`1970-01-01T${endTime}:00Z`);

    const workShift = await this.databaseService.workShift.create({
      data: {
        id: workShiftId,
        days,
        startTime: startTimeDate,
        endTime: endTimeDate,
        description,
        coefficient,
      },
    });

    return workShift;
  }
}

import { Injectable } from '@nestjs/common';
import { DatabaseCommonService, UuidService } from '../common';
import type { CreateLocality, Locality } from 'src/types/locality';

@Injectable()
export class LocalityCreateService {
  constructor(
    private readonly databaseService: DatabaseCommonService,
    private readonly uuidService: UuidService,
  ) {}

  async create(data: CreateLocality): Promise<Locality> {
    // Generar databaseName automáticamente basándose en el nombre
    // Formato: urgara-jornales-${nombre_normalizado}
    // Ejemplo: "Mar del Plata" → "urgara-jornales-mar_del_plata"
    const normalizedName = data.name
      .toLowerCase() // Convertir a minúsculas
      .normalize('NFD') // Descomponer caracteres con acentos
      .replace(/[\u0300-\u036f]/g, '') // Remover diacríticos (acentos)
      .replace(/[^a-z0-9\s]/g, '') // Remover caracteres especiales excepto espacios
      .trim() // Remover espacios al inicio y final
      .replace(/\s+/g, '_'); // Reemplazar espacios por underscore

    const databaseName = `urgara-jornales-${normalizedName}`;

    return this.databaseService.locality.create({
      data: {
        id: this.uuidService.V6(),
        ...data,
        databaseName,
      },
    });
  }
}

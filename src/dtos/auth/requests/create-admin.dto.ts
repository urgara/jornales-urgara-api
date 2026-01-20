import {
  IsString,
  IsNotEmpty,
  Length,
  Matches,
  IsEnum,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AdminRole, type AdminTypeRole } from 'src/types/auth';
import type { CreateAdmin } from 'src/types/auth';

export class CreateAdminDto implements CreateAdmin {
  @ApiProperty({
    description: 'Nombre',
    example: 'Juan',
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  name: string;

  @ApiProperty({
    description: 'Apellido',
    example: 'Pérez',
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  surname: string;

  @ApiProperty({
    description: 'DNI',
    example: '12345678',
    minLength: 8,
    maxLength: 9,
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 9)
  @Matches(/^\d+$/, { message: 'DNI must contain only numbers' })
  dni: string;

  @ApiProperty({
    description: 'Contraseña',
    example: 'Password#123',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    description: 'Rol',
    enum: AdminRole,
    example: AdminRole.ADMIN,
  })
  @IsEnum(AdminRole)
  role: AdminTypeRole;
}

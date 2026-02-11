import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { ChangePassword } from 'src/types/auth';

export class ChangePasswordDto implements ChangePassword {
  @ApiProperty({
    description: 'Contraseña actual del usuario',
    example: 'contraseñaActual123',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  currentPassword: string;

  @ApiProperty({
    description: 'Nueva contraseña (mínimo 8 caracteres)',
    example: 'nuevaContraseña456',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}

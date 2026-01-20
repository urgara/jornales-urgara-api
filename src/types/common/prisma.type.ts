import { Decimal } from '@prisma/client/runtime/index-browser';
import { Prisma } from '../../../generated/prisma/client';

type InputJsonValue = Prisma.InputJsonValue;
type JsonValue = Prisma.JsonValue;

type DecimalNumber = Decimal;
type DecimalInput = string | number | DecimalNumber;

type Json = JsonValue;
type JsonInput = InputJsonValue;

export type { DecimalNumber, DecimalInput, Json, JsonInput };

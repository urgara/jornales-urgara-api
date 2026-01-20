import type {
  GenericPaginationResponse,
  GenericDataResponse,
  GenericResponse,
} from '../common';
import type { Admin } from './admin.type';

type AdminCreatedResponse = GenericDataResponse<Admin>;

type AdminSingleResponse = GenericDataResponse<Admin>;

type AdminListResponse = GenericPaginationResponse<Admin[]>;

type AdminUpdatedResponse = GenericDataResponse<Admin>;

type AdminDeletedResponse = GenericResponse;

type LoginResponse = GenericResponse;

type LogoutResponse = GenericResponse;

export type {
  AdminCreatedResponse,
  AdminSingleResponse,
  AdminListResponse,
  AdminUpdatedResponse,
  AdminDeletedResponse,
  LoginResponse,
  LogoutResponse,
};

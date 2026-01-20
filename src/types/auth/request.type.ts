import type { Request } from 'express';
import type { AdminClientToken } from './jwt-payload.type';

export interface ReqAdmin extends Request {
  admin: AdminClientToken;
}

export interface ReqWithClientInfo extends Request {
  REQUEST_CLIENT_IP: string;
  REQUEST_USER_AGENT: string;
}

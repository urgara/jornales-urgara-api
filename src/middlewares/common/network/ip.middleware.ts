import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, NextFunction, Response } from 'express';
import apiConfig from '../../../config/api.config';

// req.socket.remoteAddress no sirve en produccion, porque esta de por medio nginx como proxy inverso en la instacia de aws, entonces siempre devuelve ip local. (127.0.0.1)
@Injectable()
export class IpMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    const realIp = req.headers['x-real-ip'] as string;
    const cloudflareIp = req.headers['cf-connecting-ip'] as string;

    // En producción, preferimos usar la IP del encabezado Cloudflare o la primera IP de X-Forwarded-For
    const REQUEST_CLIENT_IP =
      cloudflareIp ?? // Usar Cloudflare IP si está presente
      realIp ?? // Usar X-Real-IP si está presente
      req.socket.remoteAddress; //ambos son ip del cliente

    // User-Agent del cliente
    const REQUEST_USER_AGENT = req.get('User-Agent') || 'Unknown';

    // req.socket.remoteAddress no sirve en este caso porque esta nginx como proxy inverso entonces siempre devuelve ip local. (127.0.0.1)
    req[apiConfig().REQUEST_CLIENT_IP] = REQUEST_CLIENT_IP;
    req[apiConfig().REQUEST_USER_AGENT] = REQUEST_USER_AGENT;

    next();
  }
}

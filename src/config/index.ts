import type apiConfig from './api.config';
import type secretsConfig from './secrests.config';

export type ApiConfig = ReturnType<typeof apiConfig>;
export type SecretsConfig = ReturnType<typeof secretsConfig>;

export interface AppConfig {
  api: ApiConfig;
  secrets: SecretsConfig;
}

// Helper para obtener el tipo completo de configuración
export type ConfigType = AppConfig;

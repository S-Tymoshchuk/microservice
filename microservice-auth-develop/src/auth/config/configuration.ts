import { MailerOptions } from '@nestjs-modules/mailer';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import ormConfig from '@config/ormConfig';
import { config } from 'dotenv';

config();
export interface ServerConfig {
  port: number;
  environment: string;
}

export interface JwtConfig {
  accessTokenPrivateKey: string;
  accessTokenPublicKey: string;
  accessTokenExpiresIn: string;
  refreshTokenPrivateKey: string;
  refreshTokenPublicKey: string;
  refreshTokenExpiresIn: string;
}

export interface Configuration {
  server: ServerConfig;
  jwt: JwtConfig;
  email: MailerOptions;
  database: TypeOrmModuleOptions;
}

const b64ToStr = (b64) => Buffer.from(b64, 'base64').toString('ascii');
export default (): Configuration => ({
  server: {
    environment: process.env.NODE_ENV,
    port: parseInt(process.env.PORT),
  },
  jwt: {
    accessTokenPrivateKey: b64ToStr(process.env.AUTH_JWT_ACCESS_TOKEN_PRIVATE_KEY),
    accessTokenPublicKey: b64ToStr(process.env.AUTH_JWT_ACCESS_TOKEN_PUBLIC_KEY),
    accessTokenExpiresIn: process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenPrivateKey: b64ToStr(process.env.AUTH_JWT_REFRESH_TOKEN_PRIVATE_KEY),
    refreshTokenPublicKey: b64ToStr(process.env.AUTH_JWT_REFRESH_TOKEN_PUBLIC_KEY),
    refreshTokenExpiresIn: process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN,
  },
  email: {
    transport: {
      host: process.env.AUTH_SMTP_HOST,
      port: parseInt(process.env.AUTH_SMTP_PORT, 10),
      secure: Boolean(process.env.AUTH_SMTP_SECURE),
      auth: {
        user: process.env.AUTH_SMTP_USER,
        pass: process.env.AUTH_SMTP_PASSWORD,
      },
    },
    defaults: {
      from: process.env.AUTH_EMAIL_SENDER,
    },
  },
  database: ormConfig,
});

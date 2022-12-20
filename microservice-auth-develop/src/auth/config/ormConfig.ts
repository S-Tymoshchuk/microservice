import { config } from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

config();

// ORM db config, this configuration file is also used for the typeorm
// migration setup. Make sure to update package.json script before move the file.
export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.AUTH_DATABASE_HOST,
  port: parseInt(process.env.AUTH_DATABASE_PORT, 10),
  username: process.env.AUTH_DATABASE_USERNAME,
  password: process.env.AUTH_DATABASE_PASSWORD,
  database: process.env.AUTH_DATABASE_NAME,
  //migrationsRun: process.env.AUTH_DATABASE_MIGRATIONS_RUN === 'true',
  entities: [__dirname + '/../database/entities/*.entity.{ts,js}'],
  migrations: [__dirname + '/../database/migrations/*.{ts,js}'],
  synchronize: true,
  autoLoadEntities: true,
  logging: false,
};

export default ormConfig;

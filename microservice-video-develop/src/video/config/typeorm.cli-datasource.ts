import { DataSource } from 'typeorm';
import { typeOrmConfig } from '@config/typeorm.config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default new DataSource({
  ...(typeOrmConfig as PostgresConnectionOptions),
  host: 'localhost',
  port: 5433,
});

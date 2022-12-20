import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import ormConfig from '@config/ormConfig';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

config();

export default new DataSource({
  ...(<PostgresConnectionOptions>ormConfig),
  host: 'localhost',
  port: 5432,
});

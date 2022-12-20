import { DataSource, DataSourceOptions } from 'typeorm';
import ormConfig from '@config/ormConfig';

export const AppDataSource = new DataSource(ormConfig as DataSourceOptions);

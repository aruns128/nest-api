import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'passwd',
  database: 'nest-api',
  synchronize: true,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
};

export default databaseConfig;

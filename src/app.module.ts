import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from './courses/courses.module';
import databaseConfig from './database.module';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), AuthModule, CoursesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

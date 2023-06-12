import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Courses } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course-dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Courses)
    private readonly courseRepository: Repository<Courses>,
  ) {}

  async createCourse(createCouses: CreateCourseDto) {
    return await this.courseRepository.save(createCouses);
  }
}

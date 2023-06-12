import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course-dto';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post('create')
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    return await this.coursesService.createCourse(createCourseDto);
  }
}

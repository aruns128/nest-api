import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create-user')
  createUser(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.createUser(createAuthDto);
  }

  @Get('get-users')
  @UseGuards(JwtAuthGuard)
  getAllUsers() {
    return this.authService.getAllUsers();
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() createAuthDto: { email: string; password: string }) {
    const { email, password } = createAuthDto;
    const user = await this.authService.validateUser(email, password);
    if (user) {
      return { message: 'Login successful', user };
    } else {
      return { message: 'Invalid email or password' };
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(
    createAuthDto: CreateAuthDto,
  ): Promise<Partial<CreateAuthDto | undefined>> {
    const { email, role, password } = createAuthDto;
    const userExists = await this.findByUsername(email);

    if (userExists) {
      throw new BadRequestException('User already exists');
    } else {
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltOrRounds);
      const userDetails = {
        email,
        password: hashedPassword,
        role,
      };

      const newUser = this.userRepository.create(userDetails);

      const createdUser = await this.userRepository.save(newUser);

      const response = {
        id: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
      };

      return response;
    }
  }

  async getAllUsers(): Promise<Users[]> {
    return await this.userRepository.find({ select: ['id', 'email', 'role'] });
  }

  async findByUsername(email: string): Promise<Users | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<Users | undefined>> {
    console.log(email);
    const user = await this.findByUsername(email);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = await this.generateToken(user.id);
        const retunObject = { token: token, id: user.id, email: user.email };
        return retunObject;
      }
    } else {
      return undefined;
    }
  }
  async validateUserByJwt(payload: JwtPayload) {
    const user = await this.userRepository.find({
      where: { id: payload.userId },
    });
    return user;
  }

  async generateToken(userId: number) {
    const payload: JwtPayload = { userId };
    return this.jwtService.sign(payload);
  }

  async getUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    const retunObject = { id: user.id, email: user.email, role: user.role };
    return retunObject;
  }
}

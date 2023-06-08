import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
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

  async createUser(createAuthDto: CreateAuthDto): Promise<CreateAuthDto> {
    const { password, email, role } = createAuthDto;
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const userDetails = {
      email,
      password: hashedPassword,
      role,
    };
    const newUser = this.userRepository.create(userDetails);

    return await this.userRepository.save(newUser);
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
    const user = await this.findByUsername(email);
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = await this.generateToken(user.id);
      const retunObject = { token: token, id: user.id, email: user.email };
      return retunObject;
    }
    return undefined;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  // async validateUser(email: string, password: string) {
  //   // Implement your own user validation logic
  //   const user = await this.userRepository.findByUsername(email);
  //   if (user && user.password === password) {
  //     return user;
  //   }
  //   return null;
  // }

  async validateUserByJwt(payload: JwtPayload) {
    // Implement your own user validation logic based on the payload
    const user = await this.userRepository.find({
      where: { id: payload.userId },
    });
    return user;
  }

  async generateToken(userId: number) {
    const payload: JwtPayload = { userId };
    return this.jwtService.sign(payload);
  }
}

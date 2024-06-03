import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema'; // Use User directly
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const { email, password, name } = createUserDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      this.logger.warn(`Email ${email} already exists`);
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({ email, name, password: hashedPassword });
    await user.save();

    this.logger.log(`User created with email: ${email}`);
    return this.signIn(user);
  }

  async signIn(user: User): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user._id };
    const accessToken = this.jwtService.sign(payload);
    this.logger.log(`User signed in with email: ${user.email}`);
    return {
      access_token: accessToken,
    };
  }

  async validateUser(email: string, pass: string): Promise<User> {
    const user: User = await this.userModel.findOne({ email });

    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    this.logger.warn(`Invalid credentials for email: ${email}`);
    throw new UnauthorizedException('Invalid credentials');
  }
}

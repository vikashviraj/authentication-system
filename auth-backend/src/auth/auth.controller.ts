import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { User } from './schemas/user.schema';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const result = await this.authService.signUp(createUserDto);
      res.status(HttpStatus.CREATED).send(result);
    } catch (error) {
      this.logger.error('Sign-up failed', error.stack);
      res.status(HttpStatus.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    try {
      const user: User = await this.authService.validateUser(
        signInDto.email,
        signInDto.password,
      );
      if (!user) {
        this.logger.warn('Invalid credentials');
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .send({ error: 'Invalid credentials' });
      }
      const result = await this.authService.signIn(user);
      res.status(HttpStatus.OK).send(result);
    } catch (error) {
      this.logger.error('Sign-in failed', { error });
      res.status(HttpStatus.UNAUTHORIZED).send({ message: error.message });
    }
  }

  @Get('auth-validate')
  @UseGuards(JwtAuthGuard)
  async authValidate(@Res() res: Response) {
    res.status(HttpStatus.OK).send({ message: 'Authenticated' });
  }
}

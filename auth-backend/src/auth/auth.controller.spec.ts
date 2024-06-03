import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { User } from './schemas/user.schema';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    signUp: jest.fn(),
    validateUser: jest.fn(),
    signIn: jest.fn(),
  };

  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('signUp', () => {
    it('should sign up a user and return created status', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'example@example.com',
        password: 'john@doe123',
      };
      const result = { email: 'example@example.com', password: 'john@doe123' };
      const res = mockResponse();

      mockAuthService.signUp.mockResolvedValue(result);

      await authController.signUp(createUserDto, res);

      expect(mockAuthService.signUp).toHaveBeenCalledWith(createUserDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.send).toHaveBeenCalledWith(result);
    });

    it('should handle sign up failure', async () => {
      const createUserDto: CreateUserDto = {
        name: 'foo',
        email: 'example@example.com',
        password: 'password',
      };
      const res = mockResponse();
      const error = new Error('Sign up error');

      mockAuthService.signUp.mockRejectedValue(error);

      await authController.signUp(createUserDto, res);

      expect(mockAuthService.signUp).toHaveBeenCalledWith(createUserDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('signIn', () => {
    it('should sign in a user and return OK status', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const user = {
        name: 'test-name',
        email: 'test@example.com',
        password: 'password',
      } as unknown as User;
      const result = { email: 'test@example.com', password: 'password' };
      const res = mockResponse();

      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.signIn.mockResolvedValue(result);

      await authController.signIn(signInDto, res);

      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        signInDto.email,
        signInDto.password,
      );
      expect(mockAuthService.signIn).toHaveBeenCalledWith(user);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(result);
    });

    it('should handle invalid credentials', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const res = mockResponse();

      mockAuthService.validateUser.mockResolvedValue(null);

      await authController.signIn(signInDto, res);

      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        signInDto.email,
        signInDto.password,
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(res.send).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should handle sign in failure', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const res = mockResponse();
      const error = new Error('Sign in error');

      mockAuthService.validateUser.mockRejectedValue(error);

      await authController.signIn(signInDto, res);

      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        signInDto.email,
        signInDto.password,
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(res.send).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('authValidate', () => {
    it('should validate auth and return OK status', async () => {
      const res = mockResponse();

      await authController.authValidate(res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith({ message: 'Authenticated' });
    });
  });
});

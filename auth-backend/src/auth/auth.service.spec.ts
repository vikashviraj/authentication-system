import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;

  const mockJwtService = {
    sign: jest.fn(),
  };

  class MockUserModel {
    public email: string;
    public password: string;
    public name: string;
    public _id: string;

    constructor(public data: any) {
      Object.assign(this, data);
      this._id = 'userId';
    }
    save = jest.fn().mockResolvedValue(this);
    static findOne = jest.fn();
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: MockUserModel },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should sign up a new user and return access token', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      };
      const accessToken = 'accessToken';

      MockUserModel.findOne.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword' as never);
      mockJwtService.sign.mockReturnValue(accessToken);

      const result = await authService.signUp(createUserDto);

      expect(MockUserModel.findOne).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: createUserDto.email,
        sub: 'userId',
      });
      expect(result).toEqual({ access_token: accessToken });
    });

    it('should throw BadRequestException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      };
      const existingUser: User = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      } as User;

      MockUserModel.findOne.mockResolvedValue(existingUser);

      await expect(authService.signUp(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(MockUserModel.findOne).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
    });
  });

  describe('signIn', () => {
    it('should sign in a user and return access token', async () => {
      const user: User = {
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
        _id: 'userId',
      } as User;
      const accessToken = 'accessToken';

      mockJwtService.sign.mockReturnValue(accessToken);

      const result = await authService.signIn(user);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: 'userId',
      });
      expect(result).toEqual({ access_token: accessToken });
    });
  });

  describe('validateUser', () => {
    it('should return the user if validation is successful', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const hashedPassword = 'hashedpassword';
      const user: User = {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
      } as User;

      MockUserModel.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await authService.validateUser(email, password);

      expect(MockUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException if validation fails', async () => {
      const email = 'test@example.com';
      const password = 'password';

      MockUserModel.findOne.mockResolvedValue(null);

      await expect(authService.validateUser(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(MockUserModel.findOne).toHaveBeenCalledWith({ email });
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const hashedPassword = 'hashedpassword';
      const user: User = {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
      } as User;

      MockUserModel.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(authService.validateUser(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(MockUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });
  });
});

import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto, SignupDto } from './dtos';
import { RefreshToken, User } from './schemas';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>,
    private jwtService: JwtService
  ) {}

  async signup(signupData: SignupDto) {
    const { name, email, password } = signupData;

    try {
      // TODO: Check if email is in use
      const emailInUse = await this.userModel.findOne({ email }).exec();

      if (emailInUse) {
        throw new ConflictException('Email already in use');
      }

      // TODO: Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // TODO: Create user document and save in mongodb
      const user = new this.userModel({
        name, email, password: hashedPassword
      });

      await user.save();
      return user;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred during signup');
    }
  }

  async login(loginData: LoginDto) {
    const { email, password } = loginData;

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const passCompare = await bcrypt.compare(password, user.password);
    if (!passCompare) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const token = await this.generateUserToken(user._id)

    return {
      ...token,
      userId: user._id
    }
  }

  async refreshTokens(refreshToken: string) {
    const token = await this.refreshTokenModel.findOne({
      token: refreshToken, 
      expiryDate: { $gte: new Date() }
    })

    if(!token) {
      throw new UnauthorizedException("Refresh token is invalid or has expired");
    }

    return this.generateUserToken(token.userId);
  }

  async generateUserToken(userId) {
    const accessToken = this.jwtService.sign({userId}, {expiresIn: "7d"});
    const refreshToken = uuidv4();

    await this.storeRefreshToken(userId, refreshToken);

    return {
      accessToken,
      refreshToken
    }
  }

  async storeRefreshToken(userId, token: string) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    await this.refreshTokenModel.updateOne(
      { token, userId }, 
      { $set: { expiryDate } }, 
      { upsert: true }
     );
  }

  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google'
    }

    return {
      message: 'User information from google',
      user: req.user
    }
  }
}

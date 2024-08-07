import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema, RefreshToken, RefreshTokenSchema } from './schemas';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: User.name, 
        schema: UserSchema 
      },
      { 
        name: RefreshToken.name, 
        schema: RefreshTokenSchema 
      }
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],})
export class AuthModule {}

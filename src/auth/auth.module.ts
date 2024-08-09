import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema, RefreshToken, RefreshTokenSchema } from './schemas';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import config from 'src/config/config';
  
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
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
  exports: [AuthService, MongooseModule],
})
export class AuthModule {}

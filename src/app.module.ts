import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import config from './config/config';
import { PaymentModule } from './payment/payment.module';
import { XmlParserModule } from './xml-parser/xml-parser.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, load:[config] }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        secret: config.get('jwt.secret'),
        signOptions: { expiresIn: '7d' },
      }),
      global: true,
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        uri: config.get('database.connect'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    BookingModule,
    PaymentModule,
    XmlParserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

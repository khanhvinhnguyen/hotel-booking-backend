import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { AuthModule } from '../auth/auth.module';
import { XmlParserService } from '../xml-parser/xml-parser.service';
import { BookingController } from './booking.controller';
import { XmlParserModule } from 'src/xml-parser/xml-parser.module';

@Module({
  imports: [
    AuthModule,
    XmlParserModule,
  ],
  controllers: [BookingController],
  providers: [XmlParserService, JwtAuthGuard, AuthService],
})
export class BookingModule {}

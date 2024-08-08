import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { XmlParserModule } from 'src/xml-parser/xml-parser.module';
import { AuthModule } from '../auth/auth.module';
import { XmlParserService } from '../xml-parser/xml-parser.service';
import { BookingController } from './booking.controller';

@Module({
  imports: [
    AuthModule,
    XmlParserModule,
  ],
  controllers: [BookingController],
  providers: [XmlParserService, JwtAuthGuard, AuthService],
})
export class BookingModule {}

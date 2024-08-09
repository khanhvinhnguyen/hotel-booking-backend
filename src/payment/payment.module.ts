import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { XmlParserModule } from '../xml-parser/xml-parser.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [XmlParserModule, ConfigModule],
  controllers: [PaymentController],
})
export class PaymentModule {}

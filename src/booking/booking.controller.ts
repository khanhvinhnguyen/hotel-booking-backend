import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard';
import { XmlParserService } from '../xml-parser/xml-parser.service';

@ApiTags('auth')
@Controller('booking')
export class BookingController {
  constructor(private readonly xmlParserService: XmlParserService) {}

  @Get(':confirmationNo')
  @UseGuards(JwtAuthGuard)
  async getBooking(@Param('confirmationNo') confirmationNo: string) {
    const bookingData = await this.xmlParserService.getBookingData(confirmationNo);
    return bookingData;
  }
}
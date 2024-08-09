import {
  Controller,
  Post,
  Param,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { XmlParserService } from '../xml-parser/xml-parser.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly xmlParserService: XmlParserService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':confirmation_no')
  async initiatePayment(
    @Param('confirmation_no') confirmation_no: string,
    @Res() res,
  ) {
    // Load booking details
    const bookingDetails = await this.xmlParserService.parseXmlToJson(
      `public/XML/booking_${confirmation_no}.xml`,
    );

    // If booking not found, return a 404 error
    if (!bookingDetails) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Booking not found' });
    }

    // Extract required details from booking
    const { rateamount, first_name, last_name, email, phone_number } =
      bookingDetails;
    const { amount, currency } = rateamount;

    // Vietcombank payment integration details
    const merchantSiteCode = this.configService.get('payment.merchantSiteCode');
    const returnUrl = 'http://localhost:3000/payment-success';
    const cancelUrl = 'http://localhost:3000/payment-fail';
    const notifyUrl = 'http://your-server.com/payment-notification';

    const orderCode = confirmation_no; // Use confirmation number as order code

    // Generate the checksum
    const checksumString = `${merchantSiteCode}|${orderCode}|${''}|${amount}|${currency}|${first_name} ${last_name}|${email}|${phone_number}|${''}|${returnUrl}|${cancelUrl}|${notifyUrl}|${'vi'}|${this.configService.get('payment.merchantPasscode')}`;
    const checksum = crypto.createHash('md5').update(checksumString).digest('hex');

    // Redirect to Vietcombank payment page
    const paymentUrl = `https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/api/web/checkout/version_1_0?function=CreateOrder&merchant_site_code=${merchantSiteCode}&order_code=${orderCode}&amount=${amount}&currency=${currency}&buyer_fullname=${first_name} ${last_name}&buyer_email=${email}&buyer_mobile=${phone_number}&return_url=${returnUrl}&cancel_url=${cancelUrl}&notify_url=${notifyUrl}&language=vi&checksum=${checksum}`;

    res.redirect(paymentUrl);
  }
}

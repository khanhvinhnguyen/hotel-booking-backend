import { Controller, Post, Param, Res, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':confirmation_no')
  async processPayment(
    @Param('confirmation_no') confirmationNo: string,
    @Req() req,
    @Res() res
  ) {
    const amount = 1000000000;
    const returnUrl = 'http://localhost:3000/payment-success';
    const cancelUrl = 'http://localhost:3000/payment-fail';
    const notifyUrl = 'http://localhost:8000/payment-notify';

    const paymentData = await this.paymentService.createPayment(confirmationNo, amount, returnUrl, cancelUrl, notifyUrl);

    if (paymentData.result_code === '0000') {
      return res.redirect(paymentData.result_data.checkout_url);
    } else {
      return res.redirect(cancelUrl);
    }
  }
}
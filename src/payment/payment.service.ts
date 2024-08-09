import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  private readonly vcbApiUrl = 'https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/api/web/checkout/version_1_0';
  private readonly merchantSiteCode = 'your_merchant_site_code';
  private readonly merchantPasscode = 'your_merchant_passcode';

  async createPayment(confirmationNo: string, amount: number, returnUrl: string, cancelUrl: string, notifyUrl: string) {
    const orderCode = `order_${confirmationNo}`;
    const checksum = this.generateChecksum(orderCode, amount, returnUrl, cancelUrl, notifyUrl);

    const formData = {
      function: 'CreateOrder',
      merchant_site_code: this.merchantSiteCode,
      order_code: orderCode,
      amount: amount.toFixed(2),
      currency: 'VND',
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notify_url: notifyUrl,
      checksum: checksum,
    };

    const response = await axios.post(this.vcbApiUrl, formData);
    return response.data;
  }

  private generateChecksum(orderCode: string, amount: number, returnUrl: string, cancelUrl: string, notifyUrl: string): string {
    const rawData = `${this.merchantSiteCode}|${orderCode}|${amount}|VND|${returnUrl}|${cancelUrl}|${notifyUrl}|${this.merchantPasscode}`;
    return crypto.createHash('md5').update(rawData).digest('hex');
  }
}
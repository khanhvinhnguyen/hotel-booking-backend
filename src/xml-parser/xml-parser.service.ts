import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import path from 'path';
import * as xml2js from 'xml2js';

@Injectable()
export class XmlParserService {
  private parser: xml2js.Parser;

  constructor() {
    this.parser = new xml2js.Parser({ explicitArray: false });
  }

  async getBookingData(confirmationNo: string): Promise<any> {
    const filePath = path.join(__dirname, '..', 'public', 'XML', `booking_${confirmationNo}.xml`);
    const xmlData = fs.readFileSync(filePath, 'utf8');
    const jsonData = await this.parseXmlToJson(xmlData);
    return this.transformData(jsonData);
  }

  private async parseXmlToJson(xml: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.parser.parseString(xml, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  private transformData(data: any): any {
    // Assuming the structure based on the example provided
    const booking = data.Booking;

    return {
      confirmation_no: booking.confirmation_no,
      resv_name_id: booking.resv_name_id,
      arrival: booking.arrival,
      departure: booking.departure,
      adults: booking.adults,
      children: booking.children,
      roomtype: booking.roomtype,
      ratecode: booking.ratecode,
      rateamount: {
        amount: booking.rateamount.amount,
        currency: booking.rateamount.currency,
      },
      guarantee: booking.guarantee,
      method_payment: booking.method_payment,
      computed_resv_status: booking.computed_resv_status,
      last_name: booking.last_name,
      first_name: booking.first_name,
      title: booking.title,
      phone_number: booking.phone_number,
      email: booking.email,
      booking_balance: booking.booking_balance,
      booking_created_date: booking.booking_created_date,
    };
  }
}

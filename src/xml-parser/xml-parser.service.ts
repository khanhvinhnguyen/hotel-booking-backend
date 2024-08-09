import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as xml2js from 'xml2js';

@Injectable()
export class XmlParserService {
  private parser: xml2js.Parser;

  constructor() {
    this.parser = new xml2js.Parser({ explicitArray: false });
  }

  async getBookingData(confirmationNo: string): Promise<any> {
    const filePath = path.join(__dirname, '..', '..', 'public', 'XML', `booking_${confirmationNo}.xml`);
    const xmlData = fs.readFileSync(filePath, 'utf8');
    const jsonData = await this.parseXmlToJson(xmlData);
    return this.transformData(jsonData);
  }

  async parseXmlToJson(xml: string): Promise<any> {
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
    const reservation = data?.['soap:Envelope']?.['soap:Body']?.['FetchBookingResponse']?.['HotelReservation'];
    if (!reservation) {
      throw new Error('Reservation data not found');
    }
  
    const resGuests = reservation['r:ResGuests']?.['r:ResGuest'];
    const guestProfiles = resGuests?.['r:Profiles']?.['Profile'] || [];
    const guest = Array.isArray(guestProfiles) ? guestProfiles.find(profile => profile['Customer'])?.['Customer']?.['PersonName'] : guestProfiles['Customer']?.['PersonName'];
  
    return {
      confirmation_no: reservation['r:UniqueIDList']?.['c:UniqueID']?.[0]?._,
      resv_name_id: reservation['r:UniqueIDList']?.['c:UniqueID']?.[1]?._,
      arrival: reservation['r:RoomStays']?.['hc:RoomStay']?.['hc:TimeSpan']?.['hc:StartDate'],
      departure: reservation['r:RoomStays']?.['hc:RoomStay']?.['hc:TimeSpan']?.['hc:EndDate'],
      adults: reservation['r:RoomStays']?.['hc:RoomStay']?.['hc:GuestCounts']?.['hc:GuestCount']?.[0]?.count,
      children: reservation['r:RoomStays']?.['hc:RoomStay']?.['hc:GuestCounts']?.['hc:GuestCount']?.[1]?.count,
      roomtype: reservation['r:RoomStays']?.['hc:RoomStay']?.['hc:RoomTypes']?.['hc:RoomType']?.['roomTypeCode'],
      ratecode: reservation['r:RoomStays']?.['hc:RoomStay']?.['hc:RoomRates']?.['hc:RoomRate']?.['ratePlanCode'],
      rateamount: {
        amount: reservation['r:RoomStays']?.['hc:RoomStay']?.['hc:Total']?._,
        currency: reservation['r:RoomStays']?.['hc:RoomStay']?.['hc:Total']?.['currencyCode'] || 'VND'
      },
      guarantee: reservation['r:RoomStays']?.['hc:RoomStay']?.['hc:Guarantee']?.['guaranteeType'],
      method_payment: reservation['r:ReservationPayments']?.['r:ReservationPaymentInfo']?.['PaymentType'],
      computed_resv_status: reservation['computedReservationStatus'],
      last_name: guest?.['c:lastName'],
      first_name: guest?.['c:firstName'],
      title: guest?.['c:Title'],
      phone_number: guest?.['c:PhoneNumber'],
      email: guest?.['c:Email'],
      booking_balance: reservation['r:RoomStays']?.['hc:RoomStay']?.['hc:CurrentBalance'],
      booking_created_date: reservation['r:ReservationHistory']?.['insertDate'],
    };
  }
  
}

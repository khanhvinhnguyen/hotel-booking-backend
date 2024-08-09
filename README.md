Certainly! Below is a sample `README.md` that covers the setup, features, and usage of your NestJS-based hotel booking backend with XML processing, JWT authentication, and Vietcombank payment integration.

---

# Hotel Booking Backend

This is a NestJS-based backend for a hotel booking application. The application processes XML files, provides booking information via a secure API, and integrates with the Vietcombank payment gateway.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [XML to JSON Conversion](#xml-to-json-conversion)
- [API Endpoints](#api-endpoints)
- [Running Tests](#running-tests)
- [License](#license)

## Features

- **XML Processing**: Converts booking details from XML files into JSON format.
- **JWT Authentication**: Secure APIs using JWT tokens.
- **Vietcombank Payment Integration**: Allows users to pay for bookings via the Vietcombank payment gateway.
- **RESTful API**: Provides endpoints to access booking data and process payments.

## Prerequisites

- Node.js v14 or higher
- npm (Node Package Manager)
- MongoDB (for storing user and booking data)

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/hotel-booking-backend.git
   cd hotel-booking-backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Build the application**:
   ```bash
   npm run build
   ```

## Configuration

1. **Environment Variables**:
   Create a `.env` file in the root directory and add the following environment variables:

   ```env
   JWT_SECRET=your_jwt_secret
   DATABASE_URL=mongodb://localhost:27017/hotel-booking
   VCB_MERCHANT_SITE_CODE=your_merchant_site_code
   VCB_MERCHANT_PASSCODE=your_merchant_passcode
   ```

2. **XML Files**:
   Place your booking XML files in the `public/XML` directory. The files should be named in the format `booking_<confirmation_no>.xml`.

## Usage

### Starting the Server

To start the server, run:

```bash
npm run start
```

By default, the server will run on `http://localhost:8000`.

### XML to JSON Conversion

The application includes an XML-to-JSON converter designed to handle any XML file format used in the booking process. The algorithm is designed to be efficient, using a recursive approach to traverse the XML structure and convert it into the required JSON format.

### API Endpoints

#### 1. **Get Booking Information**

- **Endpoint**: `GET /booking/<confirmation_no>`
- **Description**: Fetch booking details for a given confirmation number.
- **Authentication**: JWT token required.
- **Example**: `http://localhost:8000/booking/531340616`

  **Response**:

  ```json
  {
    "confirmation_no": "531340616",
    "resv_name_id": "37596129",
    "arrival": "2024-07-24",
    "departure": "2024-07-26",
    "adults": 4,
    "children": 0,
    "roomtype": "V2GDK",
    "ratecode": "BGBARGIB",
    "rateamount": {
      "amount": 9831780,
      "currency": "VND"
    },
    "guarantee": "GRD",
    "method_payment": "VA",
    "computed_resv_status": "InHouse",
    "last_name": "Smith",
    "first_name": "Alan",
    "title": "Mr",
    "phone_number": "+84123456789",
    "email": "test@email.com",
    "booking_balance": 39327120,
    "booking_created_date": "2024-07-22"
  }
  ```

#### 2. **Process Payment**

- **Endpoint**: `POST /payment/<confirmation_no>`
- **Description**: Initiates a payment process for the given booking.
- **Authentication**: JWT token required.
- **Example**: `http://localhost:8000/payment/531340616`

  **Behavior**:

  - Redirects to Vietcombank payment page for processing.
  - On success, redirects to `http://localhost:3000/payment-success`.
  - On failure, redirects to `http://localhost:3000/payment-fail`.

### Running Tests

To run the tests for the application:

```bash
npm run test
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

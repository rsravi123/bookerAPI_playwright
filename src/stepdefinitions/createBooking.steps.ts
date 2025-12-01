import { When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import { createLogger, Logger } from 'winston';
import { CustomWorld } from './hooks';
import ResponseHandler from '../utils/responseHandler';
import JsonReader from '../utils/jsonReader';
import ExcelUtils from '../utils/excelUtils';
import { BookingDTO, BookingDetails } from '../models/types';
import type { AxiosResponse } from 'axios';

/**
 * CreateBooking Step Definitions
 * 
 * Contains Cucumber step definitions for:
 * - Creating bookings with DataTable
 * - Creating bookings from Excel data
 * - Creating bookings from JSON files
 * - Validating booking creation responses
 */

const logger: Logger = createLogger({
  format: require('winston').format.simple(),
  transports: [new (require('winston').transports.Console)()]
});

/**
 * Interface for booking data from DataTable
 */
interface BookingDataRow {
  [key: string]: string;
}

/**
 * Interface for booking request body
 */
interface BookingRequestBody {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: {
    checkin: string;
    checkout: string;
  };
  additionalneeds: string;
}

/**
 * WHEN: Create a booking with the provided details
 * 
 * Accepts data in DataTable format and creates a booking request
 * 
 * @param world - Cucumber CustomWorld instance containing test context
 * @param dataTable - Table with booking details (firstname, lastname, totalprice, etc.)
 * 
 * @example
 * When I create a booking with the following details
 *   | firstname | John          |
 *   | lastname  | Doe           |
 *   | totalprice| 100           |
 *   | depositpaid| true         |
 *   | checkin   | 2024-01-01    |
 *   | checkout  | 2024-01-05    |
 */
When('I create a booking with the following details', async function (this: CustomWorld, dataTable: DataTable) {
  try {
    const data = dataTable.rowsHash() as BookingDataRow;
    
    // Convert string values to appropriate types
    const bookingBody: BookingRequestBody = {
      firstname: data.firstname,
      lastname: data.lastname,
      totalprice: parseInt(data.totalprice, 10),
      depositpaid: data.depositpaid?.toLowerCase() === 'true',
      bookingdates: {
        checkin: data.checkin,
        checkout: data.checkout
      },
      additionalneeds: data.additionalneeds || ''
    };

    logger.info(`Creating booking with data: ${JSON.stringify(bookingBody)}`);

    // Make API request to create booking
    const response: AxiosResponse<any> = await this.apiClient.post('/booking', bookingBody);
    
    // Store response in world context for use in subsequent steps
    this.response = response;
    this.bookingId = response.data.bookingid;

    logger.info(`Booking created successfully with ID: ${this.bookingId}`);
  } catch (error) {
    logger.error(`Error creating booking: ${error}`);
    throw error;
  }
});

/**
 * WHEN: Create a booking from Excel data
 * 
 * Reads booking data from Excel file and creates a booking
 * 
 * @param world - Cucumber CustomWorld instance
 * @param filePath - Path to Excel file containing booking data
 * 
 * @example
 * When I create a booking from Excel data in "bookings.xlsx"
 */
When('I create a booking from Excel data in {string}', async function (this: CustomWorld, filePath: string) {
  try {
    const excelUtils = new ExcelUtils();
    const bookingData = excelUtils.readBookingData(filePath);

    logger.info(`Creating booking from Excel data: ${JSON.stringify(bookingData)}`);

    const response: AxiosResponse<any> = await this.apiClient.post('/booking', bookingData);
    
    this.response = response;
    this.bookingId = response.data.bookingid;

    logger.info(`Booking created from Excel with ID: ${this.bookingId}`);
  } catch (error) {
    logger.error(`Error creating booking from Excel: ${error}`);
    throw error;
  }
});

/**
 * WHEN: Create a booking from JSON file
 * 
 * Reads booking data from JSON file and creates a booking
 * 
 * @param world - Cucumber CustomWorld instance
 * @param filePath - Path to JSON file containing booking data
 * 
 * @example
 * When I create a booking from JSON data in "bookingBody.json"
 */
When('I create a booking from JSON data in {string}', async function (this: CustomWorld, filePath: string) {
  try {
    const jsonReader = new JsonReader();
    const bookingData = jsonReader.readJsonFile(filePath);

    logger.info(`Creating booking from JSON data: ${JSON.stringify(bookingData)}`);

    const response: AxiosResponse<any> = await this.apiClient.post('/booking', bookingData);
    
    this.response = response;
    this.bookingId = response.data.bookingid;

    logger.info(`Booking created from JSON with ID: ${this.bookingId}`);
  } catch (error) {
    logger.error(`Error creating booking from JSON: ${error}`);
    throw error;
  }
});

/**
 * THEN: Verify booking response contains required fields
 * 
 * Validates that the booking creation response includes essential fields
 * 
 * @param world - Cucumber CustomWorld instance
 * 
 * @example
 * Then the booking should be created successfully
 */
Then('the booking should be created successfully', async function (this: CustomWorld) {
  try {
    expect(this.response).to.exist;
    expect(this.response!.status).to.equal(200);
    expect(this.response!.data).to.have.property('bookingid');
    expect(this.response!.data.bookingid).to.be.a('number');

    logger.info(`Booking created successfully with ID: ${this.bookingId}`);
  } catch (error) {
    logger.error(`Booking creation validation failed: ${error}`);
    throw error;
  }
});

/**
 * THEN: Verify specific booking details in response
 * 
 * Validates that the booking response matches expected details
 * 
 * @param world - Cucumber CustomWorld instance
 * @param dataTable - Expected booking details
 * 
 * @example
 * Then the booking response should contain
 *   | firstname | John |
 *   | lastname  | Doe  |
 */
Then('the booking response should contain', async function (this: CustomWorld, dataTable: DataTable) {
  try {
    const expectedData = dataTable.rowsHash() as BookingDataRow;

    for (const [key, value] of Object.entries(expectedData)) {
      const actualValue = ResponseHandler.getValueFromResponse(this.response!.data, key);
      expect(actualValue).to.equal(value);
    }

    logger.info('Booking response validation passed');
  } catch (error) {
    logger.error(`Booking response validation failed: ${error}`);
    throw error;
  }
});

/**
 * THEN: Verify booking status code
 * 
 * Validates the HTTP status code of the booking response
 * 
 * @param world - Cucumber CustomWorld instance
 * @param statusCode - Expected HTTP status code
 * 
 * @example
 * Then the response status code should be 200
 */
Then('the response status code should be {int}', async function (this: CustomWorld, statusCode: number) {
  try {
    expect(this.response!.status).to.equal(statusCode);
    logger.info(`Status code validation passed: ${statusCode}`);
  } catch (error) {
    logger.error(`Status code validation failed: ${error}`);
    throw error;
  }
});

When('user creates a booking', async function (this: CustomWorld, dataTable: DataTable) {
  const hashes = dataTable.hashes();
  const bookingData = hashes[0];

  const bookingBody = {
    firstname: bookingData.firstname,
    lastname: bookingData.lastname,
    totalprice: parseInt(bookingData.totalprice),
    depositpaid: bookingData.depositpaid === 'true',
    bookingdates: {
      checkin: bookingData.checkin,
      checkout: bookingData.checkout
    },
    additionalneeds: bookingData.additionalneeds
  };

  const endpoint = this.context.session.get('endpoint');
  const response = await this.context.post(endpoint, bookingBody);
  this.context.response = response;

  const bookingDTO = ResponseHandler.deserializeResponse<BookingDTO>(response);
  expect(bookingDTO, 'Booking not created').to.not.be.undefined;
  expect(bookingDTO.bookingid, 'Booking ID missing').to.not.be.undefined;

  logger.info(`Newly created booking ID: ${bookingDTO.bookingid}`);
  this.context.session.set('bookingID', bookingDTO.bookingid);

  // Validate booking data
  validateBookingData(bookingData, bookingDTO);
});

When('user creates a booking using data {string} from Excel', async function (this: CustomWorld, dataKey: string) {
  const excelDataMap = await ExcelUtils.getData(dataKey);
  const endpoint = this.context.session.get('endpoint');

  const response = await this.context.post(endpoint, JSON.parse(excelDataMap.requestBody));
  this.context.response = response;

  const bookingDTO = ResponseHandler.deserializeResponse<BookingDTO>(response);
  expect(bookingDTO, 'Booking not created').to.not.be.undefined;

  logger.info(`Newly created booking ID: ${bookingDTO.bookingid}`);
  this.context.session.set('bookingID', bookingDTO.bookingid);
  this.context.session.set('excelDataMap', excelDataMap);
});

Then('user validates the response with JSON schema from Excel', async function (this: CustomWorld) {
  const response = this.context.response!;
  expect(response.status).to.equal(200);
  logger.info('Successfully Validated schema from Excel');
});

When('user creates a booking using data {string} from JSON file {string}', async function (this: CustomWorld, dataKey: string, jsonFile: string) {
  const requestBody = JsonReader.getRequestBody(jsonFile, dataKey);
  const endpoint = this.context.session.get('endpoint');

  const response = await this.context.post(endpoint, JSON.parse(requestBody));
  this.context.response = response;

  const bookingDTO = ResponseHandler.deserializeResponse<BookingDTO>(response);
  expect(bookingDTO, 'Booking not created').to.not.be.undefined;

  logger.info(`Newly created booking ID: ${bookingDTO.bookingid}`);
  this.context.session.set('bookingID', bookingDTO.bookingid);
});

function validateBookingData(bookingData: Record<string, string>, bookingDTO: BookingDTO): void {
  expect(bookingDTO.booking.firstname).to.equal(bookingData.firstname, 'First Name did not match');
  expect(bookingDTO.booking.lastname).to.equal(bookingData.lastname, 'Last Name did not match');
  expect(bookingDTO.booking.totalprice).to.equal(
    parseInt(bookingData.totalprice),
    'Total Price did not match'
  );
  expect(bookingDTO.booking.additionalneeds).to.equal(
    bookingData.additionalneeds,
    'Additional Needs did not match'
  );
  expect(bookingDTO.booking.bookingdates.checkin).to.equal(
    bookingData.checkin,
    'Check in Date did not match'
  );
  expect(bookingDTO.booking.bookingdates.checkout).to.equal(
    bookingData.checkout,
    'Check out Date did not match'
  );
}

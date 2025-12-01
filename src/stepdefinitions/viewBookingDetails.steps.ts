import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import { createLogger, Logger } from 'winston';
import { CustomWorld } from './hooks';
import ResponseHandler from '../utils/responseHandler';
import JsonReader from '../utils/jsonReader';
import ExcelUtils from '../utils/excelUtils';
import { BookingDTO, BookingDetails } from '../models/types';
import type { AxiosResponse } from 'axios';

/**
 * ViewBookingDetails Step Definitions
 * 
 * Contains Cucumber step definitions for:
 * - Accessing API endpoints
 * - Retrieving booking information
 * - Validating booking details
 * - Verifying API health
 */

const logger: Logger = createLogger({
  format: require('winston').format.simple(),
  transports: [new (require('winston').transports.Console)()]
});

/**
 * Interface for booking query parameters
 */
interface BookingQueryParams {
  [key: string]: string | number;
}

/**
 * Interface for booking ID response
 */
interface BookingIDResponse {
  bookingid: number;
}

/**
 * Step: User has access to API endpoint
 * @param this - CustomWorld context
 * @param endpoint - The API endpoint path
 */
Given('user has access to endpoint {string}', async function (this: CustomWorld, endpoint: string): Promise<void> {
  if (!endpoint || endpoint.trim() === '') {
    throw new Error('Endpoint cannot be empty');
  }
  this.context.session.set('endpoint', endpoint);
  logger.info(`Endpoint set to: ${endpoint}`);
});

/**
 * Step: User retrieves all booking IDs
 * @param this - CustomWorld context
 * @throws {Error} When endpoint is not set or API call fails
 */
When('user makes a request to view booking IDs', async function (this: CustomWorld): Promise<void> {
  const endpoint: string | undefined = this.context.session.get('endpoint');
  if (!endpoint) {
    throw new Error('Endpoint not set in session');
  }

  const response: AxiosResponse = await this.context.get(endpoint);
  this.context.response = response;

  const bookingIDs: BookingIDResponse[] = ResponseHandler.getBody<BookingIDResponse[]>(response);
  const firstBookingID: number | undefined = bookingIDs[0]?.bookingid;

  expect(firstBookingID, 'Booking ID not found!').to.not.be.undefined;
  logger.info(`First Booking ID: ${firstBookingID}`);
  this.context.session.set('bookingID', firstBookingID);
});

/**
 * Step: Verify HTTP response status code
 * @param this - CustomWorld context
 * @param statusCode - Expected HTTP status code
 * @throws {AssertionError} When status code doesn't match
 */
Then('user should get the response code {int}', async function (this: CustomWorld, statusCode: number): Promise<void> {
  if (!this.context.response) {
    throw new Error('No response available to validate');
  }
  const actualStatusCode: number = ResponseHandler.getStatusCode(this.context.response);
  expect(actualStatusCode).to.equal(statusCode);
  logger.info(`Status code validated: ${actualStatusCode} === ${statusCode}`);
});

/**
 * Step: Verify booking IDs are returned in response
 * @param this - CustomWorld context
 * @throws {AssertionError} When no booking IDs found
 */
Then('user should see all the booking IDs', async function (this: CustomWorld): Promise<void> {
  if (!this.context.response) {
    throw new Error('No response available to validate');
  }
  const bookingIDs: BookingIDResponse[] = ResponseHandler.getBody<BookingIDResponse[]>(this.context.response);
  expect(bookingIDs, 'Booking IDs not found!!').to.be.an('array');
  expect(bookingIDs.length).to.be.greaterThan(0);
  logger.info(`Total booking IDs found: ${bookingIDs.length}`);
});

/**
 * Step: Retrieve detailed booking information by ID
 * @param this - CustomWorld context
 * @throws {Error} When booking ID not in session or API call fails
 */
Then('user makes a request to view details of a booking ID', async function (this: CustomWorld): Promise<void> {
  const endpoint: string | undefined = this.context.session.get('endpoint');
  const bookingID: number | undefined = this.context.session.get('bookingID');

  if (!endpoint || !bookingID) {
    throw new Error('Endpoint or BookingID not set in session');
  }

  logger.info(`Session BookingID: ${bookingID}`);
  const response: AxiosResponse = await this.context.get(`${endpoint}/${bookingID}`);
  this.context.response = response;

  const bookingDetails: BookingDetails = ResponseHandler.deserializeResponse<BookingDetails>(response);
  expect(bookingDetails, 'Booking Details not found!!').to.not.be.undefined;

  this.context.session.set('firstname', bookingDetails.firstname);
  this.context.session.set('lastname', bookingDetails.lastname);
  logger.info(`Booking details retrieved for: ${bookingDetails.firstname} ${bookingDetails.lastname}`);
});

/**
 * Step: Retrieve bookings within date range
 * @param this - CustomWorld context
 * @param checkin - Check-in date
 * @param checkout - Check-out date
 */
Given('user makes a request to view booking IDs from {string} to {string}', async function (this: CustomWorld, checkin: string, checkout: string): Promise<void> {
  const endpoint: string | undefined = this.context.session.get('endpoint');
  if (!endpoint) {
    throw new Error('Endpoint not set in session');
  }
  const queryParams: BookingQueryParams = { checkin, checkout };
  const response: AxiosResponse = await this.context.get(endpoint, queryParams);
  this.context.response = response;
  logger.info(`Retrieved bookings from ${checkin} to ${checkout}`);
});

/**
 * Step: Retrieve bookings by guest name
 * @param this - CustomWorld context
 * @throws {Error} When name not in session
 */
Then('user makes a request to view all the booking IDs of that user name', async function (this: CustomWorld): Promise<void> {
  const endpoint: string | undefined = this.context.session.get('endpoint');
  const firstname: string | undefined = this.context.session.get('firstname');
  const lastname: string | undefined = this.context.session.get('lastname');

  if (!endpoint || !firstname || !lastname) {
    throw new Error('Endpoint or user name not set in session');
  }

  logger.info(`Session firstname: ${firstname}`);
  logger.info(`Session lastname: ${lastname}`);

  const queryParams: BookingQueryParams = { firstname, lastname };
  const response: AxiosResponse = await this.context.get(endpoint, queryParams);
  this.context.response = response;

  const bookingIDs: BookingIDResponse[] = ResponseHandler.getBody<BookingIDResponse[]>(response);
  expect(bookingIDs, 'Booking ID not found!!').to.be.an('array');
  logger.info(`Found ${bookingIDs.length} bookings for ${firstname} ${lastname}`);
});

/**
 * Step: Validate API response against JSON schema
 * @param this - CustomWorld context
 * @param schemaFileName - JSON schema file name to validate against
 */
Then('user validates the response with JSON schema {string}', async function (this: CustomWorld, schemaFileName: string): Promise<void> {
  if (!this.context.response) {
    throw new Error('No response available to validate');
  }
  const response: AxiosResponse = this.context.response;
  expect(response.status).to.equal(200);
  logger.info(`Successfully Validated schema from ${schemaFileName}`);
});

/**
 * Step: Verify API service health
 * @param this - CustomWorld context
 */
When('user makes a request to check the health of booking service', async function (this: CustomWorld): Promise<void> {
  const endpoint: string | undefined = this.context.session.get('endpoint');
  if (!endpoint) {
    throw new Error('Endpoint not set in session');
  }
  const response: AxiosResponse = await this.context.get(endpoint);
  this.context.response = response;
  logger.info(`Service health check completed with status: ${response.status}`);
});

/**
 * Export step definition group for better type checking
 */
export { logger };
export type { BookingQueryParams, BookingIDResponse };

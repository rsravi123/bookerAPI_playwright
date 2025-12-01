import { When } from '@cucumber/cucumber';
import { expect } from 'chai';
import { createLogger } from 'winston';
import { CustomWorld } from './hooks';
import ResponseHandler from '../utils/responseHandler';
import JsonReader from '../utils/jsonReader';
import ExcelUtils from '../utils/excelUtils';
import { BookingDetails, AuthToken } from '../models/types';

const logger = createLogger({
  format: require('winston').format.simple(),
  transports: [new (require('winston').transports.Console)()]
});

When('user creates a auth token with credential {string} & {string}', async function (this: CustomWorld, username: string, password: string) {
  const endpoint = this.context.session.get('endpoint');
  const credentials = { username, password };

  const response = await this.context.post(endpoint, credentials);
  this.context.response = response;

  const tokenData = ResponseHandler.deserializeResponse<AuthToken>(response);
  const token = tokenData.token;

  logger.info(`Auth Token: ${token}`);
  this.context.session.set('token', `token=${token}`);
});

When('user updates the details of a booking', async function (this: CustomWorld, dataTable: any) {
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
  const bookingID = this.context.session.get('bookingID');
  const token = this.context.session.get('token');

  const response = await this.context.put(
    `${endpoint}/${bookingID}`,
    bookingBody,
    { Cookie: token }
  );
  this.context.response = response;

  const bookingDetails = ResponseHandler.deserializeResponse<BookingDetails>(response);
  expect(bookingDetails, 'Booking not updated').to.not.be.undefined;
});

When('user updates the booking details using data {string} from Excel', async function (this: CustomWorld, dataKey: string) {
  const excelDataMap = await ExcelUtils.getData(dataKey);
  const endpoint = this.context.session.get('endpoint');
  const bookingID = this.context.session.get('bookingID');
  const token = this.context.session.get('token');

  const response = await this.context.put(
    `${endpoint}/${bookingID}`,
    JSON.parse(excelDataMap.requestBody),
    { Cookie: token }
  );
  this.context.response = response;

  const bookingDetails = ResponseHandler.deserializeResponse<BookingDetails>(response);
  expect(bookingDetails, 'Booking not updated').to.not.be.undefined;
  this.context.session.set('excelDataMap', excelDataMap);
});

When('user updates the booking details using data {string} from JSON file {string}', async function (this: CustomWorld, dataKey: string, jsonFile: string) {
  const requestBody = JsonReader.getRequestBody(jsonFile, dataKey);
  const endpoint = this.context.session.get('endpoint');
  const bookingID = this.context.session.get('bookingID');
  const token = this.context.session.get('token');

  const response = await this.context.put(
    `${endpoint}/${bookingID}`,
    JSON.parse(requestBody),
    { Cookie: token }
  );
  this.context.response = response;

  const bookingDetails = ResponseHandler.deserializeResponse<BookingDetails>(response);
  expect(bookingDetails, 'Booking not updated').to.not.be.undefined;
});

When('user makes a request to update first name {string} & Last name {string}', async function (this: CustomWorld, firstName: string, lastName: string) {
  const body = {
    firstname: firstName,
    lastname: lastName
  };

  const endpoint = this.context.session.get('endpoint');
  const bookingID = this.context.session.get('bookingID');
  const token = this.context.session.get('token');

  const response = await this.context.patch(
    `${endpoint}/${bookingID}`,
    body,
    { Cookie: token }
  );
  this.context.response = response;

  const bookingDetails = ResponseHandler.deserializeResponse<BookingDetails>(response);
  expect(bookingDetails, 'Booking not updated').to.not.be.undefined;
  expect(bookingDetails.firstname).to.equal(firstName, 'First Name did not match');
  expect(bookingDetails.lastname).to.equal(lastName, 'Last Name did not match');
});

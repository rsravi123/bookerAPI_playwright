"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const chai_1 = require("chai");
const winston_1 = require("winston");
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const logger = (0, winston_1.createLogger)({
    format: require('winston').format.simple(),
    transports: [new (require('winston').transports.Console)()]
});
(0, cucumber_1.Given)('user has access to endpoint {string}', async function (endpoint) {
    this.context.session.set('endpoint', endpoint);
    logger.info(`Endpoint set to: ${endpoint}`);
});
(0, cucumber_1.When)('user makes a request to view booking IDs', async function () {
    const endpoint = this.context.session.get('endpoint');
    const response = await this.context.get(endpoint);
    this.context.response = response;
    const bookingIDs = responseHandler_1.default.getBody(response);
    const firstBookingID = bookingIDs[0]?.bookingid;
    (0, chai_1.expect)(firstBookingID, 'Booking ID not found!').to.not.be.undefined;
    logger.info(`First Booking ID: ${firstBookingID}`);
    this.context.session.set('bookingID', firstBookingID);
});
(0, cucumber_1.Then)('user should get the response code {int}', async function (statusCode) {
    const actualStatusCode = responseHandler_1.default.getStatusCode(this.context.response);
    (0, chai_1.expect)(actualStatusCode).to.equal(statusCode);
});
(0, cucumber_1.Then)('user should see all the booking IDs', async function () {
    const bookingIDs = responseHandler_1.default.getBody(this.context.response);
    (0, chai_1.expect)(bookingIDs, 'Booking IDs not found!!').to.be.an('array');
    (0, chai_1.expect)(bookingIDs.length).to.be.greaterThan(0);
});
(0, cucumber_1.Then)('user makes a request to view details of a booking ID', async function () {
    const endpoint = this.context.session.get('endpoint');
    const bookingID = this.context.session.get('bookingID');
    logger.info(`Session BookingID: ${bookingID}`);
    const response = await this.context.get(`${endpoint}/${bookingID}`);
    this.context.response = response;
    const bookingDetails = responseHandler_1.default.deserializeResponse(response);
    (0, chai_1.expect)(bookingDetails, 'Booking Details not found!!').to.not.be.undefined;
    this.context.session.set('firstname', bookingDetails.firstname);
    this.context.session.set('lastname', bookingDetails.lastname);
});
(0, cucumber_1.Given)('user makes a request to view booking IDs from {string} to {string}', async function (checkin, checkout) {
    const endpoint = this.context.session.get('endpoint');
    const response = await this.context.get(endpoint, { checkin, checkout });
    this.context.response = response;
});
(0, cucumber_1.Then)('user makes a request to view all the booking IDs of that user name', async function () {
    const endpoint = this.context.session.get('endpoint');
    const firstname = this.context.session.get('firstname');
    const lastname = this.context.session.get('lastname');
    logger.info(`Session firstname: ${firstname}`);
    logger.info(`Session lastname: ${lastname}`);
    const response = await this.context.get(endpoint, { firstname, lastname });
    this.context.response = response;
    const bookingIDs = responseHandler_1.default.getBody(response);
    (0, chai_1.expect)(bookingIDs, 'Booking ID not found!!').to.be.an('array');
});
(0, cucumber_1.Then)('user validates the response with JSON schema {string}', async function (schemaFileName) {
    const response = this.context.response;
    (0, chai_1.expect)(response.status).to.equal(200);
    logger.info(`Successfully Validated schema from ${schemaFileName}`);
});
(0, cucumber_1.When)('user makes a request to check the health of booking service', async function () {
    const endpoint = this.context.session.get('endpoint');
    const response = await this.context.get(endpoint);
    this.context.response = response;
});
//# sourceMappingURL=viewBookingDetails.steps.js.map
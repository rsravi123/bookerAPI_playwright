"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const chai_1 = require("chai");
const winston_1 = require("winston");
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const jsonReader_1 = __importDefault(require("../utils/jsonReader"));
const excelUtils_1 = __importDefault(require("../utils/excelUtils"));
const logger = (0, winston_1.createLogger)({
    format: require('winston').format.simple(),
    transports: [new (require('winston').transports.Console)()]
});
(0, cucumber_1.When)('user creates a auth token with credential {string} & {string}', async function (username, password) {
    const endpoint = this.context.session.get('endpoint');
    const credentials = { username, password };
    const response = await this.context.post(endpoint, credentials);
    this.context.response = response;
    const tokenData = responseHandler_1.default.deserializeResponse(response);
    const token = tokenData.token;
    logger.info(`Auth Token: ${token}`);
    this.context.session.set('token', `token=${token}`);
});
(0, cucumber_1.When)('user updates the details of a booking', async function (dataTable) {
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
    const response = await this.context.put(`${endpoint}/${bookingID}`, bookingBody, { Cookie: token });
    this.context.response = response;
    const bookingDetails = responseHandler_1.default.deserializeResponse(response);
    (0, chai_1.expect)(bookingDetails, 'Booking not updated').to.not.be.undefined;
});
(0, cucumber_1.When)('user updates the booking details using data {string} from Excel', async function (dataKey) {
    const excelDataMap = await excelUtils_1.default.getData(dataKey);
    const endpoint = this.context.session.get('endpoint');
    const bookingID = this.context.session.get('bookingID');
    const token = this.context.session.get('token');
    const response = await this.context.put(`${endpoint}/${bookingID}`, JSON.parse(excelDataMap.requestBody), { Cookie: token });
    this.context.response = response;
    const bookingDetails = responseHandler_1.default.deserializeResponse(response);
    (0, chai_1.expect)(bookingDetails, 'Booking not updated').to.not.be.undefined;
    this.context.session.set('excelDataMap', excelDataMap);
});
(0, cucumber_1.When)('user updates the booking details using data {string} from JSON file {string}', async function (dataKey, jsonFile) {
    const requestBody = jsonReader_1.default.getRequestBody(jsonFile, dataKey);
    const endpoint = this.context.session.get('endpoint');
    const bookingID = this.context.session.get('bookingID');
    const token = this.context.session.get('token');
    const response = await this.context.put(`${endpoint}/${bookingID}`, JSON.parse(requestBody), { Cookie: token });
    this.context.response = response;
    const bookingDetails = responseHandler_1.default.deserializeResponse(response);
    (0, chai_1.expect)(bookingDetails, 'Booking not updated').to.not.be.undefined;
});
(0, cucumber_1.When)('user makes a request to update first name {string} & Last name {string}', async function (firstName, lastName) {
    const body = {
        firstname: firstName,
        lastname: lastName
    };
    const endpoint = this.context.session.get('endpoint');
    const bookingID = this.context.session.get('bookingID');
    const token = this.context.session.get('token');
    const response = await this.context.patch(`${endpoint}/${bookingID}`, body, { Cookie: token });
    this.context.response = response;
    const bookingDetails = responseHandler_1.default.deserializeResponse(response);
    (0, chai_1.expect)(bookingDetails, 'Booking not updated').to.not.be.undefined;
    (0, chai_1.expect)(bookingDetails.firstname).to.equal(firstName, 'First Name did not match');
    (0, chai_1.expect)(bookingDetails.lastname).to.equal(lastName, 'Last Name did not match');
});
//# sourceMappingURL=updateBooking.steps.js.map
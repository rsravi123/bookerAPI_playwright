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
(0, cucumber_1.When)('user creates a booking', async function (dataTable) {
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
    const bookingDTO = responseHandler_1.default.deserializeResponse(response);
    (0, chai_1.expect)(bookingDTO, 'Booking not created').to.not.be.undefined;
    (0, chai_1.expect)(bookingDTO.bookingid, 'Booking ID missing').to.not.be.undefined;
    logger.info(`Newly created booking ID: ${bookingDTO.bookingid}`);
    this.context.session.set('bookingID', bookingDTO.bookingid);
    // Validate booking data
    validateBookingData(bookingData, bookingDTO);
});
(0, cucumber_1.When)('user creates a booking using data {string} from Excel', async function (dataKey) {
    const excelDataMap = await excelUtils_1.default.getData(dataKey);
    const endpoint = this.context.session.get('endpoint');
    const response = await this.context.post(endpoint, JSON.parse(excelDataMap.requestBody));
    this.context.response = response;
    const bookingDTO = responseHandler_1.default.deserializeResponse(response);
    (0, chai_1.expect)(bookingDTO, 'Booking not created').to.not.be.undefined;
    logger.info(`Newly created booking ID: ${bookingDTO.bookingid}`);
    this.context.session.set('bookingID', bookingDTO.bookingid);
    this.context.session.set('excelDataMap', excelDataMap);
});
(0, cucumber_1.Then)('user validates the response with JSON schema from Excel', async function () {
    const response = this.context.response;
    (0, chai_1.expect)(response.status).to.equal(200);
    logger.info('Successfully Validated schema from Excel');
});
(0, cucumber_1.When)('user creates a booking using data {string} from JSON file {string}', async function (dataKey, jsonFile) {
    const requestBody = jsonReader_1.default.getRequestBody(jsonFile, dataKey);
    const endpoint = this.context.session.get('endpoint');
    const response = await this.context.post(endpoint, JSON.parse(requestBody));
    this.context.response = response;
    const bookingDTO = responseHandler_1.default.deserializeResponse(response);
    (0, chai_1.expect)(bookingDTO, 'Booking not created').to.not.be.undefined;
    logger.info(`Newly created booking ID: ${bookingDTO.bookingid}`);
    this.context.session.set('bookingID', bookingDTO.bookingid);
});
function validateBookingData(bookingData, bookingDTO) {
    (0, chai_1.expect)(bookingDTO.booking.firstname).to.equal(bookingData.firstname, 'First Name did not match');
    (0, chai_1.expect)(bookingDTO.booking.lastname).to.equal(bookingData.lastname, 'Last Name did not match');
    (0, chai_1.expect)(bookingDTO.booking.totalprice).to.equal(parseInt(bookingData.totalprice), 'Total Price did not match');
    (0, chai_1.expect)(bookingDTO.booking.additionalneeds).to.equal(bookingData.additionalneeds, 'Additional Needs did not match');
    (0, chai_1.expect)(bookingDTO.booking.bookingdates.checkin).to.equal(bookingData.checkin, 'Check in Date did not match');
    (0, chai_1.expect)(bookingDTO.booking.bookingdates.checkout).to.equal(bookingData.checkout, 'Check out Date did not match');
}
//# sourceMappingURL=createBooking.steps.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    format: require('winston').format.simple(),
    transports: [new (require('winston').transports.Console)()]
});
(0, cucumber_1.When)('user makes a request to delete booking with basic auth {string} & {string}', async function (username, password) {
    const endpoint = this.context.session.get('endpoint');
    const bookingID = this.context.session.get('bookingID');
    const axiosInstance = this.context.getAxiosInstance();
    // Add basic auth header
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    const response = await axiosInstance.delete(`${endpoint}/${bookingID}`, {
        headers: {
            'Authorization': `Basic ${credentials}`
        }
    });
    this.context.response = response;
    logger.info(`Delete booking response status: ${response.status}`);
});
//# sourceMappingURL=deleteBooking.steps.js.map
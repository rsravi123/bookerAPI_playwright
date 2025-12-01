"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    format: require('winston').format.simple(),
    transports: [new (require('winston').transports.Console)()]
});
class ResponseHandler {
    /**
     * Deserialize API response to TypeScript object
     */
    static deserializeResponse(response) {
        try {
            const data = response.data;
            logger.info(`Deserialized response: ${JSON.stringify(data, null, 2)}`);
            return data;
        }
        catch (error) {
            logger.error(`Error deserializing response: ${error}`);
            throw error;
        }
    }
    /**
     * Get response status code
     */
    static getStatusCode(response) {
        return response.status;
    }
    /**
     * Get response headers
     */
    static getHeaders(response) {
        return response.headers;
    }
    /**
     * Get response body as JSON
     */
    static getBody(response) {
        return response.data;
    }
}
exports.default = ResponseHandler;
//# sourceMappingURL=responseHandler.js.map
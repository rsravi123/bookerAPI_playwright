"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const winston_1 = require("winston");
const propertiesFile_1 = __importDefault(require("./propertiesFile"));
const logger = (0, winston_1.createLogger)({
    format: require('winston').format.simple(),
    transports: [new (require('winston').transports.Console)()]
});
class TestContext {
    constructor() {
        this.response = null;
        this.session = new Map();
        const baseURL = propertiesFile_1.default.getProperty('baseURL');
        const contentType = propertiesFile_1.default.getProperty('content.type');
        this.axiosInstance = axios_1.default.create({
            baseURL: baseURL,
            headers: {
                'Content-Type': contentType,
                'Accept': contentType
            },
            timeout: 10000
        });
        // Add request interceptor for logging
        this.axiosInstance.interceptors.request.use((config) => {
            logger.info('-'.repeat(100));
            logger.info(`Request Method => ${config.method?.toUpperCase()}`);
            logger.info(`Request URI => ${config.url}`);
            logger.info(`Request Headers => ${JSON.stringify(config.headers)}`);
            logger.info(`Request Body => ${config.data}`);
            return config;
        });
        // Add response interceptor for logging
        this.axiosInstance.interceptors.response.use((response) => {
            logger.info(`Response Status => ${response.status}`);
            logger.info(`Response Headers => ${JSON.stringify(response.headers)}`);
            logger.info(`Response Body => ${JSON.stringify(response.data, null, 2)}`);
            logger.info('-'.repeat(100));
            return response;
        });
    }
    /**
     * Get configured axios instance
     */
    getAxiosInstance() {
        return this.axiosInstance;
    }
    /**
     * Make GET request
     */
    async get(endpoint, params) {
        try {
            this.response = await this.axiosInstance.get(endpoint, { params });
            return this.response;
        }
        catch (error) {
            logger.error(`GET request failed: ${error}`);
            throw error;
        }
    }
    /**
     * Make POST request
     */
    async post(endpoint, data, headers) {
        try {
            const config = headers ? { headers } : undefined;
            this.response = await this.axiosInstance.post(endpoint, data, config);
            return this.response;
        }
        catch (error) {
            logger.error(`POST request failed: ${error}`);
            throw error;
        }
    }
    /**
     * Make PUT request
     */
    async put(endpoint, data, headers) {
        try {
            const config = headers ? { headers } : undefined;
            this.response = await this.axiosInstance.put(endpoint, data, config);
            return this.response;
        }
        catch (error) {
            logger.error(`PUT request failed: ${error}`);
            throw error;
        }
    }
    /**
     * Make PATCH request
     */
    async patch(endpoint, data, headers) {
        try {
            const config = headers ? { headers } : undefined;
            this.response = await this.axiosInstance.patch(endpoint, data, config);
            return this.response;
        }
        catch (error) {
            logger.error(`PATCH request failed: ${error}`);
            throw error;
        }
    }
    /**
     * Make DELETE request
     */
    async delete(endpoint, config) {
        try {
            this.response = await this.axiosInstance.delete(endpoint, config);
            return this.response;
        }
        catch (error) {
            logger.error(`DELETE request failed: ${error}`);
            throw error;
        }
    }
    /**
     * Clear session data
     */
    clearSession() {
        this.session.clear();
        this.response = null;
    }
}
exports.default = TestContext;
//# sourceMappingURL=testContext.js.map
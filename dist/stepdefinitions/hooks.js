"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomWorld = void 0;
const cucumber_1 = require("@cucumber/cucumber");
const testContext_1 = __importDefault(require("../utils/testContext"));
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    format: require('winston').format.simple(),
    transports: [new (require('winston').transports.Console)()]
});
class CustomWorld {
    constructor(options) {
        this.context = new testContext_1.default();
    }
}
exports.CustomWorld = CustomWorld;
(0, cucumber_1.setWorldConstructor)(CustomWorld);
(0, cucumber_1.Before)(async function (scenario) {
    logger.info('*'.repeat(100));
    logger.info(`Scenario: ${scenario.pickle.name}`);
    logger.info('*'.repeat(100));
});
(0, cucumber_1.After)(async function (scenario) {
    const status = scenario.result?.status;
    logger.info('*'.repeat(100));
    logger.info(`Scenario: ${scenario.pickle.name} --> ${status}`);
    logger.info('*'.repeat(100));
    // Clear session after each scenario
    this.context.clearSession();
});
//# sourceMappingURL=hooks.js.map
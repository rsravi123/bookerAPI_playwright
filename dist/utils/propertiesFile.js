"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    format: require('winston').format.simple(),
    transports: [new (require('winston').transports.Console)()]
});
class PropertiesFile {
    static getProperty(property) {
        if (!this.initialized) {
            this.loadProperties();
        }
        const value = this.properties.get(property);
        if (!value) {
            logger.error(`Property '${property}' not found in config.properties`);
            throw new Error(`Property '${property}' not found`);
        }
        return value.trim();
    }
    static loadProperties() {
        try {
            const configPath = path_1.default.resolve('config.properties');
            const content = fs_1.default.readFileSync(configPath, 'utf-8');
            const lines = content.split('\n');
            lines.forEach((line) => {
                line = line.trim();
                if (line && !line.startsWith('#') && line.includes('=')) {
                    const [key, value] = line.split('=');
                    this.properties.set(key.trim(), value.trim());
                }
            });
            this.initialized = true;
        }
        catch (error) {
            logger.error(`Error loading properties file: ${error}`);
            throw error;
        }
    }
}
PropertiesFile.properties = new Map();
PropertiesFile.initialized = false;
exports.default = PropertiesFile;
//# sourceMappingURL=propertiesFile.js.map
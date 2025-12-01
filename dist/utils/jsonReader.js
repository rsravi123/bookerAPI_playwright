"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const winston_1 = require("winston");
const propertiesFile_1 = __importDefault(require("./propertiesFile"));
const logger = (0, winston_1.createLogger)({
    format: require('winston').format.simple(),
    transports: [new (require('winston').transports.Console)()]
});
class JsonReader {
    /**
     * Read JSON file and get request body by key
     */
    static getRequestBody(jsonFileName, jsonKey) {
        try {
            const dataPath = propertiesFile_1.default.getProperty('test.data.path');
            const fullPath = path_1.default.resolve(dataPath, jsonFileName);
            if (!fs_1.default.existsSync(fullPath)) {
                throw new Error(`JSON file not found at path: ${fullPath}`);
            }
            const fileContent = fs_1.default.readFileSync(fullPath, 'utf-8');
            const jsonData = JSON.parse(fileContent);
            if (!jsonData[jsonKey]) {
                throw new Error(`NO DATA FOUND in JSON file '${jsonFileName}' for key '${jsonKey}'`);
            }
            logger.info(`Retrieved request body for key '${jsonKey}' from file '${jsonFileName}'`);
            return JSON.stringify(jsonData[jsonKey]);
        }
        catch (error) {
            logger.error(`Error reading JSON file: ${error}`);
            throw error;
        }
    }
    /**
     * Get entire JSON data by key
     */
    static getJsonData(jsonFileName, jsonKey) {
        try {
            const dataPath = propertiesFile_1.default.getProperty('test.data.path');
            const fullPath = path_1.default.resolve(dataPath, jsonFileName);
            const fileContent = fs_1.default.readFileSync(fullPath, 'utf-8');
            const jsonData = JSON.parse(fileContent);
            if (!jsonData[jsonKey]) {
                throw new Error(`NO DATA FOUND in JSON file '${jsonFileName}' for key '${jsonKey}'`);
            }
            return jsonData[jsonKey];
        }
        catch (error) {
            logger.error(`Error reading JSON data: ${error}`);
            throw error;
        }
    }
}
exports.default = JsonReader;
//# sourceMappingURL=jsonReader.js.map
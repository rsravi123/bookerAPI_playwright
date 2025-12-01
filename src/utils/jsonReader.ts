import fs from 'fs';
import path from 'path';
import { createLogger, Logger } from 'winston';
import PropertiesFile from './propertiesFile';

const logger: Logger = createLogger({
  format: require('winston').format.simple(),
  transports: [new (require('winston').transports.Console)()]
});

class JsonReader {
  /**
   * Read JSON file and get request body by key
   */
  static getRequestBody(jsonFileName: string, jsonKey: string): string {
    try {
      const dataPath = PropertiesFile.getProperty('test.data.path');
      const fullPath = path.resolve(dataPath, jsonFileName);

      if (!fs.existsSync(fullPath)) {
        throw new Error(`JSON file not found at path: ${fullPath}`);
      }

      const fileContent = fs.readFileSync(fullPath, 'utf-8');
      const jsonData = JSON.parse(fileContent);

      if (!jsonData[jsonKey]) {
        throw new Error(`NO DATA FOUND in JSON file '${jsonFileName}' for key '${jsonKey}'`);
      }

      logger.info(`Retrieved request body for key '${jsonKey}' from file '${jsonFileName}'`);
      return JSON.stringify(jsonData[jsonKey]);
    } catch (error) {
      logger.error(`Error reading JSON file: ${error}`);
      throw error;
    }
  }

  /**
   * Get entire JSON data by key
   */
  static getJsonData(jsonFileName: string, jsonKey: string): Record<string, any> {
    try {
      const dataPath = PropertiesFile.getProperty('test.data.path');
      const fullPath = path.resolve(dataPath, jsonFileName);
      const fileContent = fs.readFileSync(fullPath, 'utf-8');
      const jsonData = JSON.parse(fileContent);

      if (!jsonData[jsonKey]) {
        throw new Error(`NO DATA FOUND in JSON file '${jsonFileName}' for key '${jsonKey}'`);
      }

      return jsonData[jsonKey];
    } catch (error) {
      logger.error(`Error reading JSON data: ${error}`);
      throw error;
    }
  }

  /**
   * Read JSON file and return the data
   */
  readJsonFile(filePath: string): Record<string, any> {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`JSON file not found at path: ${filePath}`);
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);

      logger.info(`Read JSON data from file: ${filePath}`);
      return jsonData;
    } catch (error) {
      logger.error(`Error reading JSON file: ${error}`);
      throw error;
    }
  }
}

export default JsonReader;

import fs from 'fs';
import path from 'path';
import { createLogger } from 'winston';

const logger = createLogger({
  format: require('winston').format.simple(),
  transports: [new (require('winston').transports.Console)()]
});

class PropertiesFile {
  private static properties: Map<string, string> = new Map();
  private static initialized = false;

  static getProperty(property: string): string {
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

  private static loadProperties(): void {
    try {
      const configPath = path.resolve('config.properties');
      const content = fs.readFileSync(configPath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line) => {
        line = line.trim();
        if (line && !line.startsWith('#') && line.includes('=')) {
          const [key, value] = line.split('=');
          this.properties.set(key.trim(), value.trim());
        }
      });

      this.initialized = true;
    } catch (error) {
      logger.error(`Error loading properties file: ${error}`);
      throw error;
    }
  }
}

export default PropertiesFile;

import axios, { AxiosResponse } from 'axios';
import { createLogger } from 'winston';

const logger = createLogger({
  format: require('winston').format.simple(),
  transports: [new (require('winston').transports.Console)()]
});

class ResponseHandler {
  /**
   * Deserialize API response to TypeScript object
   */
  static deserializeResponse<T>(response: AxiosResponse): T {
    try {
      const data = response.data as T;
      logger.info(`Deserialized response: ${JSON.stringify(data, null, 2)}`);
      return data;
    } catch (error) {
      logger.error(`Error deserializing response: ${error}`);
      throw error;
    }
  }

  /**
   * Get response status code
   */
  static getStatusCode(response: AxiosResponse): number {
    return response.status;
  }

  /**
   * Get response headers
   */
  static getHeaders(response: AxiosResponse): Record<string, any> {
    return response.headers;
  }

  /**
   * Get response body as JSON
   */
  static getBody<T>(response: AxiosResponse): T {
    return response.data as T;
  }

  /**
   * Get nested value from response using dot notation
   */
  static getValueFromResponse(responseData: any, path: string): any {
    try {
      const keys = path.split('.');
      let value = responseData;

      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key];
        } else {
          logger.warn(`Path '${path}' not found in response`);
          return undefined;
        }
      }

      return value;
    } catch (error) {
      logger.error(`Error getting value from response: ${error}`);
      throw error;
    }
  }
}

export default ResponseHandler;

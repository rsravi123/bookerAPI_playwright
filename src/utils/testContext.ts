import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { createLogger, Logger } from 'winston';
import PropertiesFile from './propertiesFile';

const logger: Logger = createLogger({
  format: require('winston').format.simple(),
  transports: [new (require('winston').transports.Console)()]
});

class TestContext {
  private axiosInstance: AxiosInstance;
  public response: AxiosResponse | null = null;
  public session: Map<string, any> = new Map();

  constructor() {
    const baseURL = PropertiesFile.getProperty('baseURL');
    const contentType = PropertiesFile.getProperty('content.type');

    this.axiosInstance = axios.create({
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
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * Make GET request
   */
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<AxiosResponse<T>> {
    try {
      this.response = await this.axiosInstance.get<T>(endpoint, { params });
      return this.response;
    } catch (error) {
      logger.error(`GET request failed: ${error}`);
      throw error;
    }
  }

  /**
   * Make POST request
   */
  async post<T = any>(endpoint: string, data?: any, headers?: Record<string, any>): Promise<AxiosResponse<T>> {
    try {
      const config = headers ? { headers } : undefined;
      this.response = await this.axiosInstance.post<T>(endpoint, data, config);
      return this.response;
    } catch (error) {
      logger.error(`POST request failed: ${error}`);
      throw error;
    }
  }

  /**
   * Make PUT request
   */
  async put<T = any>(endpoint: string, data?: any, headers?: Record<string, any>): Promise<AxiosResponse<T>> {
    try {
      const config = headers ? { headers } : undefined;
      this.response = await this.axiosInstance.put<T>(endpoint, data, config);
      return this.response;
    } catch (error) {
      logger.error(`PUT request failed: ${error}`);
      throw error;
    }
  }

  /**
   * Make PATCH request
   */
  async patch<T = any>(endpoint: string, data?: any, headers?: Record<string, any>): Promise<AxiosResponse<T>> {
    try {
      const config = headers ? { headers } : undefined;
      this.response = await this.axiosInstance.patch<T>(endpoint, data, config);
      return this.response;
    } catch (error) {
      logger.error(`PATCH request failed: ${error}`);
      throw error;
    }
  }

  /**
   * Make DELETE request
   */
  async delete<T = any>(endpoint: string, config?: Record<string, any>): Promise<AxiosResponse<T>> {
    try {
      this.response = await this.axiosInstance.delete<T>(endpoint, config);
      return this.response;
    } catch (error) {
      logger.error(`DELETE request failed: ${error}`);
      throw error;
    }
  }

  /**
   * Clear session data
   */
  clearSession(): void {
    this.session.clear();
    this.response = null;
  }
}

export default TestContext;

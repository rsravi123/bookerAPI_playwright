import { setWorldConstructor, Before, After, IWorldOptions } from '@cucumber/cucumber';
import TestContext from '../utils/testContext';
import { createLogger, Logger } from 'winston';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const logger: Logger = createLogger({
  format: require('winston').format.simple(),
  transports: [new (require('winston').transports.Console)()]
});

export class CustomWorld {
  public context: TestContext;
  public apiClient: AxiosInstance;
  public response?: AxiosResponse<any>;
  public bookingId?: number;
  public testData: Record<string, any> = {};

  constructor(options: IWorldOptions) {
    this.context = new TestContext();
    this.apiClient = axios.create({
      baseURL: 'https://restful-booker.herokuapp.com',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

setWorldConstructor(CustomWorld);

Before(async function (scenario) {
  logger.info('*'.repeat(100));
  logger.info(`Scenario: ${scenario.pickle.name}`);
  logger.info('*'.repeat(100));
});

After(async function (scenario) {
  const status = scenario.result?.status;
  logger.info('*'.repeat(100));
  logger.info(`Scenario: ${scenario.pickle.name} --> ${status}`);
  logger.info('*'.repeat(100));

  // Clear session after each scenario
  this.context.clearSession();
});

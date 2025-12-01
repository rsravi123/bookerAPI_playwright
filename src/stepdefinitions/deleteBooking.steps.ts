import { When } from '@cucumber/cucumber';
import { createLogger } from 'winston';
import { CustomWorld } from './hooks';

const logger = createLogger({
  format: require('winston').format.simple(),
  transports: [new (require('winston').transports.Console)()]
});

When('user makes a request to delete booking with basic auth {string} & {string}', async function (this: CustomWorld, username: string, password: string) {
  const endpoint = this.context.session.get('endpoint');
  const bookingID = this.context.session.get('bookingID');

  const axiosInstance = this.context.getAxiosInstance();

  // Add basic auth header
  const credentials = Buffer.from(`${username}:${password}`).toString('base64');
  const response = await axiosInstance.delete(`${endpoint}/${bookingID}`, {
    headers: {
      'Authorization': `Basic ${credentials}`
    }
  });

  this.context.response = response;
  logger.info(`Delete booking response status: ${response.status}`);
});

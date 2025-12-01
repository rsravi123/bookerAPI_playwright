import fs from 'fs';
import path from 'path';
import { createLogger, Logger } from 'winston';
import * as XLSX from 'xlsx';
import PropertiesFile from './propertiesFile';

const logger: Logger = createLogger({
  format: require('winston').format.simple(),
  transports: [new (require('winston').transports.Console)()]
});

class ExcelUtils {
  /**
   * Read data from Excel file by row key
   */
  static async getData(dataKey: string): Promise<Record<string, string>> {
    try {
      const excelPath = PropertiesFile.getProperty('test.data.path') + 
                        PropertiesFile.getProperty('excel.name');
      const sheetName = PropertiesFile.getProperty('sheet.name');

      if (!fs.existsSync(excelPath)) {
        throw new Error(`Excel file not found at path: ${excelPath}`);
      }

      const workbook = XLSX.readFile(excelPath);
      const worksheet = workbook.Sheets[sheetName];

      if (!worksheet) {
        throw new Error(`Sheet '${sheetName}' not found in workbook`);
      }

      const data = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet);
      const row = data.find((r: Record<string, string>) => r['dataKey'] === dataKey || Object.values(r)[0] === dataKey);

      if (!row) {
        throw new Error(`NO DATA FOUND for dataKey: ${dataKey}`);
      }

      logger.info(`Retrieved data for key '${dataKey}' from Excel`);
      return row as Record<string, string>;
    } catch (error) {
      logger.error(`Error reading Excel data: ${error}`);
      throw error;
    }
  }

  /**
   * Write data to Excel file
   */
  static async setCellData(
    result: string,
    dataKey: string,
    columnName: string
  ): Promise<void> {
    try {
      const excelPath = PropertiesFile.getProperty('test.data.path') + 
                        PropertiesFile.getProperty('excel.name');
      const sheetName = PropertiesFile.getProperty('sheet.name');

      const workbook = XLSX.readFile(excelPath);
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet);

      const rowIndex = data.findIndex((r: Record<string, string>) => r['dataKey'] === dataKey);
      if (rowIndex === -1) {
        throw new Error(`Row not found for dataKey: ${dataKey}`);
      }

      data[rowIndex][columnName] = result;
      const newWorksheet = XLSX.utils.json_to_sheet(data);
      workbook.Sheets[sheetName] = newWorksheet;

      XLSX.writeFile(workbook, excelPath);
      logger.info(`Successfully wrote result to Excel for key '${dataKey}'`);
    } catch (error) {
      logger.error(`Error writing to Excel: ${error}`);
      throw error;
    }
  }

  /**
   * Read booking data from Excel file
   */
  readBookingData(filePath: string): Record<string, any> {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`Excel file not found at path: ${filePath}`);
      }

      const workbook = XLSX.readFile(filePath);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

      if (data.length === 0) {
        throw new Error(`No data found in Excel file: ${filePath}`);
      }

      const row = data[0];
      logger.info(`Read booking data from Excel: ${JSON.stringify(row)}`);

      return {
        firstname: row.firstname,
        lastname: row.lastname,
        totalprice: parseInt(row.totalprice, 10),
        depositpaid: row.depositpaid?.toString().toLowerCase() === 'true',
        bookingdates: {
          checkin: row.checkin,
          checkout: row.checkout
        },
        additionalneeds: row.additionalneeds || ''
      };
    } catch (error) {
      logger.error(`Error reading booking data from Excel: ${error}`);
      throw error;
    }
  }
}

export default ExcelUtils;

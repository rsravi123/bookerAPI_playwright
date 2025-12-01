declare class ExcelUtils {
    /**
     * Read data from Excel file by row key
     */
    static getData(dataKey: string): Promise<Record<string, string>>;
    /**
     * Write data to Excel file
     */
    static setCellData(result: string, dataKey: string, columnName: string): Promise<void>;
}
export default ExcelUtils;
//# sourceMappingURL=excelUtils.d.ts.map
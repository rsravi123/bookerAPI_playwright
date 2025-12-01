declare class JsonReader {
    /**
     * Read JSON file and get request body by key
     */
    static getRequestBody(jsonFileName: string, jsonKey: string): string;
    /**
     * Get entire JSON data by key
     */
    static getJsonData(jsonFileName: string, jsonKey: string): Record<string, any>;
}
export default JsonReader;
//# sourceMappingURL=jsonReader.d.ts.map
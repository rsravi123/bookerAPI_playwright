import { AxiosResponse } from 'axios';
declare class ResponseHandler {
    /**
     * Deserialize API response to TypeScript object
     */
    static deserializeResponse<T>(response: AxiosResponse): T;
    /**
     * Get response status code
     */
    static getStatusCode(response: AxiosResponse): number;
    /**
     * Get response headers
     */
    static getHeaders(response: AxiosResponse): Record<string, any>;
    /**
     * Get response body as JSON
     */
    static getBody<T>(response: AxiosResponse): T;
}
export default ResponseHandler;
//# sourceMappingURL=responseHandler.d.ts.map
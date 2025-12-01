import { AxiosInstance, AxiosResponse } from 'axios';
declare class TestContext {
    private axiosInstance;
    response: AxiosResponse | null;
    session: Map<string, any>;
    constructor();
    /**
     * Get configured axios instance
     */
    getAxiosInstance(): AxiosInstance;
    /**
     * Make GET request
     */
    get<T = any>(endpoint: string, params?: Record<string, any>): Promise<AxiosResponse<T>>;
    /**
     * Make POST request
     */
    post<T = any>(endpoint: string, data?: any, headers?: Record<string, any>): Promise<AxiosResponse<T>>;
    /**
     * Make PUT request
     */
    put<T = any>(endpoint: string, data?: any, headers?: Record<string, any>): Promise<AxiosResponse<T>>;
    /**
     * Make PATCH request
     */
    patch<T = any>(endpoint: string, data?: any, headers?: Record<string, any>): Promise<AxiosResponse<T>>;
    /**
     * Make DELETE request
     */
    delete<T = any>(endpoint: string, config?: Record<string, any>): Promise<AxiosResponse<T>>;
    /**
     * Clear session data
     */
    clearSession(): void;
}
export default TestContext;
//# sourceMappingURL=testContext.d.ts.map
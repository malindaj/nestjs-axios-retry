import { DynamicModule } from "@nestjs/common";
import { AxiosRequestConfig } from "axios";
import { IAxiosRetryConfig } from "axios-retry";
interface AxiosRetryOptions {
    axiosConfig?: AxiosRequestConfig;
    axiosRetryConfig?: IAxiosRetryConfig;
}
/**
 * A module that provides retry functionality for Axios HTTP requests.
 * This module can be imported in a NestJS application to enable automatic retry of failed requests.
 */
export declare class AxiosRetryModule {
    /**
     * Creates a dynamic module for the AxiosRetryModule.
     * @param options - Optional configuration options for the retry behavior.
     * @returns A dynamic module that can be imported in a NestJS application.
     */
    static forRoot(options?: AxiosRetryOptions): DynamicModule;
}
export {};
//# sourceMappingURL=axios-retry.module.d.ts.map
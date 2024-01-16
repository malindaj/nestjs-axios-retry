import { HttpModule, HttpService } from "@nestjs/axios";
import { Module, DynamicModule, Global } from "@nestjs/common";
import axios, { AxiosRequestConfig } from "axios";
import axiosRetry, { IAxiosRetryConfig } from "axios-retry";

interface AxiosRetryOptions {
  axiosConfig?: AxiosRequestConfig;
  axiosRetryConfig?: IAxiosRetryConfig;
}

/**
 * A module that provides retry functionality for Axios HTTP requests.
 * This module can be imported in a NestJS application to enable automatic retry of failed requests.
 */
@Global()
@Module({})
export class AxiosRetryModule {
  /**
   * Creates a dynamic module for the AxiosRetryModule.
   * @param options - Optional configuration options for the retry behavior.
   * @returns A dynamic module that can be imported in a NestJS application.
   */
  static forRoot(options: AxiosRetryOptions = {}): DynamicModule {
    const axiosInstance = axios.create(options.axiosConfig);
    axiosRetry(
      axiosInstance,
      options.axiosRetryConfig || {
        retries: 3,
        retryDelay: axiosRetry.exponentialDelay,
        shouldResetTimeout: true,
        retryCondition: (error) => {
          // Custom retry condition
          return error?.response?.status === 429;
        },
        onRetry(retryCount, error, requestConfig) {
          // Custom callback on retry
          console.log(`Retrying request attempt ${retryCount}`);
          //console.log(error);
          //console.log(requestConfig);
        },
      }
    );

    const axiosProvider = {
      provide: HttpService,
      useValue: new HttpService(axiosInstance),
    };

    return {
      module: AxiosRetryModule,
      imports: [HttpModule],
      providers: [axiosProvider],
      exports: [axiosProvider],
    };
  }
}

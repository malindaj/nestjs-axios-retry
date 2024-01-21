import { HttpModule, HttpService } from "@nestjs/axios";
import { Module, DynamicModule, Global } from "@nestjs/common";
import axios, { AxiosRequestConfig } from "axios";
import axiosRetry, { IAxiosRetryConfig, DEFAULT_OPTIONS } from "axios-retry";

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
  static forRoot(
    options: AxiosRetryOptions = { axiosRetryConfig: DEFAULT_OPTIONS }
  ): DynamicModule {
    const axiosInstance = axios.create(options.axiosConfig);
    axiosRetry(axiosInstance, options.axiosRetryConfig);

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

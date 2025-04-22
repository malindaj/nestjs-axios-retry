import { DynamicModule } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { IAxiosRetryConfig } from 'axios-retry';

export interface AxiosRetryOptions {
  axiosConfig?: AxiosRequestConfig;
  axiosRetryConfig?: IAxiosRetryConfig;
}

export declare class AxiosRetryModule {
  static forRoot(options?: AxiosRetryOptions): DynamicModule;
} 
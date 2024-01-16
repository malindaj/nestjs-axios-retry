import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  // Basic fetch data example
  async fetchData() {
    const response = await firstValueFrom(
      this.httpService.get('https://example.com/data'),
    );
    return response.data;
  }

  // Fetch with custom retry configuration
  async fetchDataWithCustomRetry() {
    const response = await firstValueFrom(
      this.httpService.get('https://example.com/data', {
        'axios-retry': {
          retries: 5,
          retryDelay: (retryCount) => retryCount * 1000,
        },
      }),
    );
    return response.data;
  }

  // Fetch with exponential backoff retry
  async fetchDataWithExponentialBackoff() {
    const response = await firstValueFrom(
      this.httpService.get('https://example.com/data', {
        'axios-retry': {
          retries: 3,
          retryDelay: axiosRetry.exponentialDelay,
        },
      }),
    );
    return response.data;
  }

  // Fetch with specific retry condition
  async fetchDataWithRetryCondition() {
    const response = await firstValueFrom(
      this.httpService.get('https://example.com/data', {
        'axios-retry': {
          retries: 3,
          retryCondition: (error) => error?.response?.status === 503,
        },
      }),
    );
    return response.data;
  }

  // Fetch with onRetry callback
  async fetchDataWithOnRetryCallback() {
    const response = await firstValueFrom(
      this.httpService.get('https://example.com/data', {
        'axios-retry': {
          retries: 3,
          onRetry: (retryCount, error, requestConfig) => {
            console.log(`Retrying request attempt ${retryCount}`);
          },
        },
      }),
    );
    return response.data;
  }
}

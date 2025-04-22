# NestJS Axios Retry

A NestJS module that provides Axios with configurable retry functionality, leveraging axios-retry for enhanced HTTP request resilience.

Compatible with NestJS 11.

**NestJS Axios Retry Module**

nestjs-axios-retry is a module for NestJS that adds retry functionality to Axios HTTP requests. It leverages axios-retry to provide configurable options for retrying failed HTTP requests, making your NestJS applications more resilient to transient errors.

**Features**
- Easy integration with NestJS's HttpModule.
- Configurable retry count, delay, and conditions.
- Support for exponential backoff.
- Custom callbacks for retry events.

**Blog Article**

For more details on the motivation behind this module, please refer to the following blog article: [Adding Retry Functionality to NestJS HTTP Requests](https://medium.com/@jarvislk/introducing-nestjs-axios-retry-enhanced-resilience-for-http-requests-in-nestjs-ccf00db15f9d)
  
**Installation**
```bash
npm install nestjs-axios-retry axios-retry
```

**Usage**
First, import and configure AxiosRetryModule in your NestJS module:

```typescript
import { Module } from '@nestjs/common';
import { AxiosRetryModule } from 'nestjs-axios-retry';
import axiosRetry from 'axios-retry';

@Module({
  imports: [
    AxiosRetryModule.forRoot({
      axiosRetryConfig: {
        retries: 5,
        retryDelay: axiosRetry.exponentialDelay,
        shouldResetTimeout: true,
        retryCondition: (error) => error.response.status === 429,
        onRetry: (retryCount, error, requestConfig) => {
          console.log(`Retrying request attempt ${retryCount}`);
        },
      },
    }),
  ],
  // ... Other configurations
})
export class AppModule {}
```
Then, inject the HttpService provided by NestJS into your service or controller:

**Basic Usage**

Use the HttpService provided by NestJS to make HTTP requests. The retry functionality is automatically applied based on your module configuration.

```typescript
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  async fetchData() {
    const response = await firstValueFrom(
      this.httpService.get('https://example.com/data'),
    );
    return response.data;
  }
}
```

**Advanced Usage**

Custom Retry Configuration
You can customize the retry behavior for individual requests:

```typescript
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
```
Exponential Backoff Retry
For exponential backoff strategy:

```typescript
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
```
Specific Retry Condition
Customize the condition under which a

retry should occur:

```typescript
async fetchDataWithRetryCondition() {
  const response = await firstValueFrom(
    this.httpService.get('https://example.com/data', {
      'axios-retry': {
        retries: 3,
        retryCondition: (error) => error.response.status === 503,
      },
    }),
  );
  return response.data;
}
```

OnRetry Callback
Implement custom actions on each retry:

```typescript
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
```
| Name             | Type          | Default                                           | Description                                                                                                                                                                   |
| ---------------- | ------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| retries          | `Number`      | `3`                                               | The number of times to retry before failing. 1 = One retry after first failure                                                                                                |
| retryCondition   | `Function`    | `isNetworkOrIdempotentRequestError`               | A callback to further control if a request should be retried. By default, it retries if it is a network error or a 5xx error on an idempotent request (GET, HEAD, OPTIONS, PUT or DELETE). |
| shouldResetTimeout | `Boolean`     | false                                             | Defines if the timeout should be reset between retries                                                                                                                       |
| retryDelay       | `Function`    | `function noDelay() { return 0; }`                | A callback to further control the delay in milliseconds between retried requests. By default there is no delay between retries. Another option is exponentialDelay ([Exponential Backoff](https://developers.google.com/analytics/devguides/reporting/core/v3/errors#backoff)). The function is passed `retryCount` and `error`. |
| onRetry          | `Function`    | `function onRetry(retryCount, error, requestConfig) { return; }` | A callback to notify when a retry is about to occur. Useful for tracing and you can any async process for example refresh a token on 401. By default nothing will occur. The function is passed `retryCount`, `error`, and `requestConfig`. |

***Credits***
This module is based on the work of ([axios-retry](https://www.npmjs.com/package/axios-retry)). Please refer to the axios-retry documentation for more details on the retry configuration options.

***Contributing***
Contributions to nestjs-axios-retry are welcome! Please refer to the project's issues and pull request sections for more details.

**License**
This project is licensed under the MIT License - see the LICENSE file for details.
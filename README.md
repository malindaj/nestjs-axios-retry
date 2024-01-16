**NestJS Axios Retry Module**

nestjs-axios-retry is a module for NestJS that adds retry functionality to Axios HTTP requests. It leverages axios-retry to provide configurable options for retrying failed HTTP requests, making your NestJS applications more resilient to transient errors.

**Features**
- Easy integration with NestJS's HttpModule.
- Configurable retry count, delay, and conditions.
- Support for exponential backoff.
- Custom callbacks for retry events.
  
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

***Contributing***
Contributions to nestjs-axios-retry are welcome! Please refer to the project's issues and pull request sections for more details.

**License**
This project is licensed under the MIT License - see the LICENSE file for details.
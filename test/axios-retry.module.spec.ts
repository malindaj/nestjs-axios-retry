import { Test, TestingModule } from "@nestjs/testing";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { HttpModule, HttpService } from "@nestjs/axios";
import { AxiosRetryModule } from "../axios-retry.module";
import { firstValueFrom } from "rxjs";

describe("AxiosRetryModule", () => {
  let httpService: HttpService;
  let mock: MockAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AxiosRetryModule.forRoot({
          axiosRetryConfig: {
            retries: 3,
            retryDelay: (retryCount) => retryCount * 1000,
            retryCondition: (error) => {
              return error?.response?.status === 429;
            },
          },
        }),
        HttpModule,
      ],
    }).compile();

    httpService = module.get<HttpService>(HttpService);
    mock = new MockAdapter(httpService.axiosRef);
  });

  it("should retry 3 times on 429 status", async () => {
    mock.onGet("/test").replyOnce(429).onGet("/test").replyOnce(200);

    const response = await firstValueFrom(httpService.get("/test"));
    expect(response?.status).toBe(200);
    expect(mock.history.get.length).toBe(2);
  });

  it("should apply exponential backoff delay on retries", async () => {
    mock.onGet("/test-backoff").reply((config) => {
      return [429, null];
    });

    const startTime = Date.now();
    try {
      await firstValueFrom(httpService.get("/test-backoff"));
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Assuming 3 retries with exponential backoff
      const expectedMinDuration = (1 + 2 + 4) * 1000; // in milliseconds
      expect(duration).toBeGreaterThanOrEqual(expectedMinDuration);
    }
  });

  it("should retry only if status is 429", async () => {
    mock
      .onGet("/test-condition")
      .replyOnce(500)
      .onGet("/test-condition")
      .replyOnce(200);

    try {
      await firstValueFrom(httpService.get("/test-condition"));
    } catch (error: any) {
      expect(error.response.status).toBe(500);
      expect(mock.history.get.length).toBe(1); // Only one request, no retries
    }
  });

  it("should not exceed the defined retry limit", async () => {
    const retryLimit = 3;
    mock.onGet("/test-limit").reply(429);

    try {
      await firstValueFrom(httpService.get("/test-limit"));
    } catch (error) {
      expect(mock.history.get.length).toBe(retryLimit + 1); // Initial request + retries
    }
  });

  it("should retry 3 times on 429 status", async () => {
    let callCount = 1;
    mock.onGet("/test").reply(() => {
      callCount++;
      return callCount <= 3 ? [429, null] : [200, "Success"];
    });

    const response = await firstValueFrom(httpService.get("/test"));
    expect(response?.status).toBe(200);
    expect(response?.data).toBe("Success");
    expect(callCount).toBe(4); // Initial request + 3 retries
  });
});

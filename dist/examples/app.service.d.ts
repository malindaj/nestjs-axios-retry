import { HttpService } from '@nestjs/axios';
export declare class AppService {
    private httpService;
    constructor(httpService: HttpService);
    fetchData(): Promise<any>;
    fetchDataWithCustomRetry(): Promise<any>;
    fetchDataWithExponentialBackoff(): Promise<any>;
    fetchDataWithRetryCondition(): Promise<any>;
    fetchDataWithOnRetryCallback(): Promise<any>;
}
//# sourceMappingURL=app.service.d.ts.map
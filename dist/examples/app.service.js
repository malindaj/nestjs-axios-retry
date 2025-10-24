"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const axios_retry_1 = __importDefault(require("axios-retry"));
const rxjs_1 = require("rxjs");
let AppService = class AppService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    // Basic fetch data example
    async fetchData() {
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('https://example.com/data'));
        return response.data;
    }
    // Fetch with custom retry configuration
    async fetchDataWithCustomRetry() {
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('https://example.com/data', {
            'axios-retry': {
                retries: 5,
                retryDelay: (retryCount) => retryCount * 1000,
            },
        }));
        return response.data;
    }
    // Fetch with exponential backoff retry
    async fetchDataWithExponentialBackoff() {
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('https://example.com/data', {
            'axios-retry': {
                retries: 3,
                retryDelay: axios_retry_1.default.exponentialDelay,
            },
        }));
        return response.data;
    }
    // Fetch with specific retry condition
    async fetchDataWithRetryCondition() {
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('https://example.com/data', {
            'axios-retry': {
                retries: 3,
                retryCondition: (error) => error?.response?.status === 503,
            },
        }));
        return response.data;
    }
    // Fetch with onRetry callback
    async fetchDataWithOnRetryCallback() {
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('https://example.com/data', {
            'axios-retry': {
                retries: 3,
                onRetry: (retryCount, error, requestConfig) => {
                    console.log(`Retrying request attempt ${retryCount}`);
                },
            },
        }));
        return response.data;
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], AppService);

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AxiosRetryModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosRetryModule = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const axios_2 = __importDefault(require("axios"));
const axios_retry_1 = __importStar(require("axios-retry"));
/**
 * A module that provides retry functionality for Axios HTTP requests.
 * This module can be imported in a NestJS application to enable automatic retry of failed requests.
 */
let AxiosRetryModule = AxiosRetryModule_1 = class AxiosRetryModule {
    /**
     * Creates a dynamic module for the AxiosRetryModule.
     * @param options - Optional configuration options for the retry behavior.
     * @returns A dynamic module that can be imported in a NestJS application.
     */
    static forRoot(options = { axiosRetryConfig: axios_retry_1.DEFAULT_OPTIONS }) {
        const axiosInstance = axios_2.default.create(options.axiosConfig);
        (0, axios_retry_1.default)(axiosInstance, options.axiosRetryConfig);
        const axiosProvider = {
            provide: axios_1.HttpService,
            useValue: new axios_1.HttpService(axiosInstance),
        };
        return {
            module: AxiosRetryModule_1,
            imports: [axios_1.HttpModule],
            providers: [axiosProvider],
            exports: [axiosProvider],
        };
    }
};
exports.AxiosRetryModule = AxiosRetryModule;
exports.AxiosRetryModule = AxiosRetryModule = AxiosRetryModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], AxiosRetryModule);

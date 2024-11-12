import axios, {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios';
import axiosRetry from 'axios-retry';
import movieServiceApiConfig from "../config/MovieServiceApiConfig";
import logger from "../middlewares/logger"
import {PopularMoviesOptions} from '../types/Interfaces';


axiosRetry(axios, {
    retries: 3,
    retryDelay: (...arg) => axiosRetry.exponentialDelay(...arg, 1000),
    retryCondition(error) {
        switch (error.response?.status) {
            //retry only if status is 500 or 501
            case 500:
            case 501:
                return true;
            default:
                return false;
        }
    },
    onRetry: (retryCount, error, requestConfig) => {
        logger.info(`retry count: `, retryCount);
        if(retryCount == 2) {
            requestConfig.url = movieServiceApiConfig.baseUrl+'/200'
        }
    },
});
class MovieDBService {
    private apiKey: string;
    private baseUrl: string;
    private client: AxiosInstance;
    private movieDiscoveryPath: string;
    private movieCreditPath: string;
    constructor() {
        this.movieDiscoveryPath='/discover/movie';
        this.movieCreditPath='/movie'
        this.apiKey = movieServiceApiConfig.accessToken;
        this.baseUrl = movieServiceApiConfig.baseUrl;
        this.client = axios.create({
            baseURL: this.baseUrl,
            headers: {
                accept:'application/json',
                Authorization: `Bearer ${this.apiKey}`
            }
        });


    }

    private async makeGetRequest<T>(endpoint: string, params: AxiosRequestConfig = {}): Promise<T> {

        try {
            const response = await this.client.get<T>(endpoint, params);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                logger.error(`API Error: ${axiosError.response.status} - ${axiosError.response.data}`);
            } else if (axiosError.request) {
                logger.error('No response received:', axiosError.request);
            } else {
                logger.error('Request setup error:', axiosError.message);
            }
            throw new Error(`Failed to fetch data from endpoint: ${endpoint}`);
        }
    }
    public async getPopularMovies(options: PopularMoviesOptions = {}): Promise<any[]> {
        // Await the promise and handle it as an axios response
        return await this.makeGetRequest<any>(this.movieDiscoveryPath, {params:options});

    }

    public async getCreditsForMovies(movieId: string): Promise<any[]> {
        return await this.makeGetRequest<any[]>(`${this.movieDiscoveryPath}/${movieId}/credits`);
    }
}

export default new MovieDBService();

import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import logger from './logger';
import movieServiceApiConfig from '../config/MovieServiceApiConfig';

const axiosClient: AxiosInstance = axios.create({
    baseURL: movieServiceApiConfig.baseUrl,
    timeout: 1000,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${movieServiceApiConfig.accessToken}`,
    },
});


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
        logger.info(retryCount)
        if(retryCount == 2) {
            requestConfig.url = movieServiceApiConfig.baseUrl
        }
    },
});

export default axiosClient;

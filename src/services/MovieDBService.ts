import {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios';
import movieServiceApiConfig from "../config/MovieServiceApiConfig";
import logger from "../middlewares/logger"
import {
    Creditors,
    CreditorsApiResponse,
    Movie,
    MovieApiResponse,
    popularMovieResponse,
    PopularMoviesOptions
} from '../types/Interfaces';

export class MovieDBService {
    private apiKey: string;
    private baseUrl: string;
    private client: AxiosInstance;
    private movieDiscoveryPath: string;
    private movieCreditPath: string;
    constructor(axiosClient: AxiosInstance) {
        this.movieDiscoveryPath='/discover/movie';
        this.movieCreditPath='/movie'
        this.apiKey = movieServiceApiConfig.accessToken;
        this.baseUrl = movieServiceApiConfig.baseUrl;
        this.client = axiosClient;

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
    public async getPopularMovies(options: PopularMoviesOptions = {}): Promise<any> {

        return await this.makeGetRequest<MovieApiResponse[]>(this.movieDiscoveryPath, {params:options});
    }

    public async getCreditsForMovies(movieId: string): Promise<any> {
        return await this.makeGetRequest<CreditorsApiResponse[]>(`${this.movieCreditPath}/${movieId}/credits`);
    }

    public async getPopularMoviesWithCredits(options: PopularMoviesOptions = {}): Promise<any[]> {

        const movies = await this.getPopularMovies(options);

        const moviesWithCreditsPromises = movies.results.map(async (movie:Movie) => {
            const creditsResponse = await this.getCreditsForMovies(movie.id.toString());
            const editors = this.editorsName(creditsResponse.crew, 'Editing')
            return new popularMovieResponse(movie, editors);
        });

        return await Promise.all(moviesWithCreditsPromises);
    }
    private editorsName = function (crew:Creditors[], knownForDepartment: string) {
        return crew.filter((names) => {
            return names.known_for_department === knownForDepartment;
        }).map(names => {

            return names.name;
        });
    };
}

import {MovieDBService} from "../../src/services/MovieDBService";
import axios, {AxiosInstance} from 'axios';
import logger from "../../src/middlewares/logger";
import {CreditorsApiResponse, MovieApiResponse, popularMovieResponse} from "../../src/types/Interfaces";


jest.mock('axios');
jest.mock('../../src/middlewares/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
}));

describe('MovieDBService', () => {
    let movieDBService: MovieDBService;
    let mockedAxiosInstance:any;
    let mockedAxios: jest.Mocked<AxiosInstance>;
    beforeEach(() => {
        mockedAxios = {
            get: jest.fn(),
            post: jest.fn(),
        } as unknown as jest.Mocked<AxiosInstance>;
        movieDBService = new MovieDBService(mockedAxios);
        jest.clearAllMocks();
    });

    describe('getPopularMovies', () => {
        it('should fetch popular movies and return the data', async () => {
            const mockData: { results: { release_date: string; vote_average: number; id: number; title: string }[] } = {
                results: [{ id: 1, title: 'Movie 1', release_date: '2024-01-01', vote_average: 8.5 }],
            };


            mockedAxios.get.mockResolvedValueOnce({ data: mockData });

            const result = await movieDBService.getPopularMovies({});

            expect(mockedAxios.get).toHaveBeenCalledWith('/discover/movie', { params: {} });
            expect(result).toEqual(mockData);
        });

        it('should log an error and throw when API call fails', async () => {
            const mockError = { response: { status: 500, data: 'Internal Server Error' } };
            mockedAxios.get.mockRejectedValueOnce(mockError);

            await expect(movieDBService.getPopularMovies()).rejects.toThrow('Failed to fetch data from endpoint: /discover/movie');
            expect(logger.error).toHaveBeenCalledWith('API Error: 500 - Internal Server Error');
        });
    });

    describe('getCreditsForMovies', () => {
        it('should fetch movie credits and return the data', async () => {
            const mockCreditData: { crew: { known_for_department: string; name: string }[] } = {
                crew: [{ name: 'Editor 1', known_for_department: 'Editing' }],
            };

            mockedAxios.get.mockResolvedValueOnce({ data: mockCreditData });

            const result = await movieDBService.getCreditsForMovies('1');

            expect(mockedAxios.get).toHaveBeenCalledWith('/movie/1/credits',{});
            expect(result).toEqual(mockCreditData);
        });
    });

    describe('getPopularMoviesWithCredits', () => {
        it('should fetch popular movies and their credits', async () => {
            const mockMovieData: {
                results: { release_date: string; vote_average: number; id: number; title: string }[]
            } = {
                results: [{ id: 1, title: 'Movie 1', release_date: '2024-01-01', vote_average: 8.5 }],
            };

            const mockCreditData: { crew: { known_for_department: string; name: string }[] } = {
                crew: [{ name: 'Editor 1', known_for_department: 'Editing' }],
            };

            mockedAxios.get
                .mockResolvedValueOnce({ data: mockMovieData }) // For getPopularMovies
                .mockResolvedValueOnce({ data: mockCreditData }); // For getCreditsForMovies

            const result = await movieDBService.getPopularMoviesWithCredits();

            const expectedResponse = [
                new popularMovieResponse(
                    mockMovieData.results[0],
                    ['Editor 1']
                ),
            ];

            expect(mockedAxios.get).toHaveBeenCalledWith('/discover/movie', { params: {} });
            expect(mockedAxios.get).toHaveBeenCalledWith('/movie/1/credits',{});
            expect(result).toEqual(expectedResponse);
        });
    });

    describe('editorsName', () => {
        it('should filter and map crew by known_for_department', () => {
            const crew = [
                { name: 'Editor 1', known_for_department: 'Editing', id: 1 },
                { name: 'Writer 1', known_for_department: 'Writing', id: 2 },
            ];

            const result = movieDBService['editorsName'](crew, 'Editing');

            expect(result).toEqual(['Editor 1']);
        });
    });
});

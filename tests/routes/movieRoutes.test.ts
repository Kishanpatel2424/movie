import request from 'supertest';
import express, { Response } from 'express';
import movieRoutes from "../../src/routes/movieRoutes";
import { MovieDBService } from '../../src/services/MovieDBService';
import { sendError, sendResponse } from '../../src/middlewares/responseHandler';

// Mock dependencies
jest.mock('../../src/services/MovieDBService');
jest.mock('../../src/middlewares/responseHandler');

const MockedMovieDBService = MovieDBService as jest.MockedClass<typeof MovieDBService>;
const mockSendResponse = sendResponse as jest.Mock;
const mockSendError = sendError as jest.Mock;

describe('Movie Router', () => {
    let app= express();

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/api/movies', movieRoutes);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return popular movies with credits when successful', async () => {

        const mockPopularMovies = [
            { id: 1, title: 'Movie 1', release_date: '2024-01-01', vote_average: 8.5, credits: ['Editor 1'] },
        ];
        MockedMovieDBService.prototype.getPopularMoviesWithCredits.mockResolvedValueOnce(mockPopularMovies);

        mockSendResponse.mockImplementation((res: Response, statusCode: number, data: any) => {
            res.status(statusCode).json(data);
        });

        const response = await request(app).get('/api/movies/popular').query({ year: '2023' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockPopularMovies);
        expect(MockedMovieDBService.prototype.getPopularMoviesWithCredits).toHaveBeenCalledWith({
            page: 1,
            sort_by: 'popularity.des',
            primary_release_year: 2023,
        });
        expect(mockSendResponse).toHaveBeenCalledWith(expect.anything(), 200, mockPopularMovies);
    });

    it('should return a 500 error when fetching popular movies fails', async () => {

        MockedMovieDBService.prototype.getPopularMoviesWithCredits.mockRejectedValueOnce(new Error('Service Error'));

        mockSendError.mockImplementation((res: Response, statusCode: number, message: string) => {
            res.status(statusCode).json({ error: message });
        });

        const response = await request(app).get('/api/movies/popular');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Error fetching popular movies' });
        expect(MockedMovieDBService.prototype.getPopularMoviesWithCredits).toHaveBeenCalled();
        expect(mockSendError).toHaveBeenCalledWith(expect.anything(), 500, 'Error fetching popular movies');
    });
});

import { Router, Request, Response } from "express";
import movieDBService from "../services/MovieDBService";
import {PopularMoviesOptions} from "../types/Interfaces";
import {sendError, sendResponse} from "../middlewares/responseHandler";

const movieRouter = Router();

movieRouter.get('/popular', async (req: Request, res: Response) => {
    try {
        const options: Partial<PopularMoviesOptions> = {
            page: 1,
            sort_by: 'popularity.des',
            // include_adult: req.query.include_adult === 'false',
            // include_video: req.query.include_video === 'false',
            // language: req.query.language as string,
            // region: req.query.region as string,
            primary_release_year: req.query.year ? parseInt(req.query.year as string) : 2024,
        };

        const popularMovies = await movieDBService.getPopularMovies(options);
        sendResponse(res, 200, popularMovies);
    } catch (error: any) {
        sendError(res, 500, 'Error fetching popular movies');
    }
});
export default movieRouter;
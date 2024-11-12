import { Router, Request, Response, NextFunction } from "express";
import { MovieDBService } from "../services/MovieDBService";
import { PopularMoviesOptions } from "../types/Interfaces";
import { sendError, sendResponse } from "../middlewares/responseHandler";
import axiosClient from "../middlewares/axiosMiddleware";
import {validateYear} from "../middlewares/requestValidations";


const movieRouter = Router();
const movieDBService = new MovieDBService(axiosClient);


movieRouter.get('/popular', validateYear, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const options: Partial<PopularMoviesOptions> = {
            page: 1,
            sort_by: 'popularity.desc',
            primary_release_year: req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear(),
        };

        const popularMovies = await movieDBService.getPopularMoviesWithCredits(options);
        sendResponse(res, 200, popularMovies);
    } catch (error: any) {
        sendError(res, 500, 'Error fetching popular movies');
    }
});

export default movieRouter;

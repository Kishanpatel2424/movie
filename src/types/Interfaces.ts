export interface Movie {
    id: number;
    title: string;
    release_date: string;
    vote_average: number;

}

export interface Genre {
    id: number;
    name: string;
}

export interface ApiResponse<T> {
    results: T[];
    page: number;
    total_pages: number;
    total_results: number;
}

export interface PopularMoviesOptions {
    page?: number;
    sort_by?: string;
    include_adult?: boolean;
    include_video?: boolean;
    language?: string;
    region?: string;
    primary_release_year?: number;
}

export interface popularMovieResponse {
    title: string;
    release_date: string;
    vote_average: number;
    editors: string[];
}
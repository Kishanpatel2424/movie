export class Movie {
    id: number;
    title: string;
    release_date: string;
    vote_average: number;
    constructor(obj?: any) {
        this.id = obj && obj.id || 0;
        this.title = obj && obj.title || '';
        this.release_date = obj && obj.release_date || '';
        this.vote_average = obj && obj.vote_average || 0;
    }
}

export class Creditors {
    id: number;
    name: string;
    known_for_department: string;

    constructor(obj?: any) {
        this.id = obj && obj.id || 0;
        this.name = obj && obj.name || '';
        this.known_for_department = obj && obj.known_for_department || '';
    }
}
export class CreditorsApiResponse {
    id: number;
    cast: Creditors[];
    crew: Creditors[];

    constructor(obj?: any) {
        this.id = obj && obj.id || 0;
        this.cast = obj && obj.cast || [];
        this.crew = obj && obj.crew || [];
    }
}

export class MovieApiResponse {
    results: Movie[];
    page: number;
    total_pages: number;
    total_results: number;


    constructor(obj?: any) {
        this.results = obj && obj.results || [];
        this.page = obj && obj.page || 0;
        this.total_pages = obj && obj.total_pages || 0;
        this.total_results = obj && obj.total_results || 0;
    }
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

export class popularMovieResponse {
    title: string;
    release_date: string;
    vote_average: number;
    editors: string[];

    constructor(obj?: any, editors?: any) {
        this.title = obj && obj.title || '';
        this.release_date = obj && obj.release_date || '';
        this.vote_average = obj && obj.vote_average || 0;
        this.editors = editors && editors || [];
    }

}
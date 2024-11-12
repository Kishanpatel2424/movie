require('dotenv').config()
interface MovieApiConfig {
    baseUrl: string;
    apiKey: string;
    accessToken:string;
}

const movieApiConfig: MovieApiConfig = {
    baseUrl: process.env.MOVIE_API_BASE_URL || '',
    apiKey: process.env.MOVIE_API_KEY || '',
    accessToken: process.env.MOVIE_ACCESS_TOKEN|| ''
};

export default movieApiConfig;
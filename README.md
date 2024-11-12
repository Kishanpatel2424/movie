
# Movie API Service

A Node.js service to fetch popular movies with customizable parameters.

## Getting Started

### Prerequisites

- **Node Version**: 23.1.0
- **Port**: Default is set to `3000`

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

- `MOVIE_ACCESS_TOKEN`: Your access token for the movie API.
- `MOVIE_API_BASE_URL`: The base URL for the movie API.
- `PORT` (optional): The port on which the server will run. Defaults to `3000` if not specified.

### Run the Application

To start the server, use:
```bash
npm start && npm serve
```

The application will run on `http://localhost:3000` by default, or on the port specified in your `.env` file.

## API Routes

### Movies Endpoint

#### Get Popular Movies

- **Endpoint**: `/api/movies/popular`
- **Method**: `GET`
- **Query Parameter**: 
  - `year` (optional, number): Filter popular movies by release year. Default 2024
  
**Example Request**:
```bash
GET /api/movies/popular?year=2023
```

**Response**: Returns a list of popular movies filtered by the specified year.

## Example Response Structure

```json
{
  "movies": [
    {
      "title": "Example Movie Title",
      "release_date": "2023-06-15",
      "vote_average": 8.5
    },
    // Additional movies
  ]
}
```

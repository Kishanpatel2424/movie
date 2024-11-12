import express from "express";
require('dotenv').config()
import logger from "./middlewares/logger";

import movieRoutes from "./routes/movieRoutes";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/movies", movieRoutes);

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
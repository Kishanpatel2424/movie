import express from "express";
import movieRoutes from "./routes/movieRoutes";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", movieRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
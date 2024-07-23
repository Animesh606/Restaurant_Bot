import express from "express";
import apiRoutes from "./routes";
import errorHandler from "./middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

app.use(errorHandler);

export default app;
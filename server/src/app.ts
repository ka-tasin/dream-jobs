import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import cors from "cors";

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1", routes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Dream Jobs" });
});

export default app;

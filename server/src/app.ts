import express, { Express, Request, Response } from "express";
import routes from "./routes/index.js";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(cors({
  origin: ["http://localhost:5173", "https://dream-jobs-kat.vercel.app"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser())


app.use("/api/v1", routes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Dream Jobs" });
});

app.use(errorHandler);

export default app;

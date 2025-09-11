import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import routes from "./routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Todo : cors

app.use(express.json());
app.use("api/v1", routes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Dream Jobs" });
});

export default app;

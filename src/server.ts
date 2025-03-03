import express, { Request, Response, NextFunction } from "express";
import statsRoutes from "./routes/statsRoutes";

const app = express();
const port = process.env.PORT || 8080;

const checkUserIdInHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.headers.userid;

  if (!userId) {
    res.status(400).json({ message: "userId is required in the headers" });
    return;
  }

  next();
};

app.use(express.json());

app.use("/courses", checkUserIdInHeaders, statsRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Path not found" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: "An error occurred",
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Server running");
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export { app, server };

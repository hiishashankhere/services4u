import "express-async-errors";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import { startServer } from "./config/database.js";
import userRouter from "./routes/user.js";
import serviceRouter from "./routes/service.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.js";

const PORT = process.env.PORT;

const app = express();

//middlewares
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (_, res) => res.json({ success: true, route: "/" }));

app.use("/api/v1", userRouter);
app.use("/api/v1", serviceRouter);

app.use(errorHandler);

startServer(app, PORT);

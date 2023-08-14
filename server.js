import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { authAccessToken } from "./repositories/tokenRepository.js";
import authRouter from "./routes/auth.js";
import reviewRouter from "./routes/review.js";
import userRouter from "./routes/user.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true
  })
);

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Requested-With, Accept"
  );
  next();
});

app.use("/auth", authRouter);

// app.use(authAccessToken);

app.use("/review", reviewRouter);

app.use("/user", userRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port: ${process.env.PORT || 8080}`);
});

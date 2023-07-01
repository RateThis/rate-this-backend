import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";

dotenv.config();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.use("/auth", authRouter);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Requested-With, Accept"
  );
  next();
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port: ${process.env.PORT || 8080}`);
});

import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port: ${process.env.PORT || 8080}`);
});

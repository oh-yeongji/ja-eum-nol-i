import dotenv from "dotenv";
dotenv.config();

import express from "express";
import dictRouter from "./routes/dictRouter.js";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use("/api", dictRouter);

app.get("/", (req, res) => {
  res.sendFile(new URL("./public/index.html", import.meta.url).pathname);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

import express from "express";
import dotenv from "dotenv";
import dictRouter from "./routes/dictRouter.js";

dotenv.config();
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

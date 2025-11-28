import express from "express";
import route from "./routes/index.js"; // ES 모듈은 확장자 꼭 붙이기

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use("/", route);

app.get("/", (req, res) => {
  res.sendFile(new URL("./public/index.html", import.meta.url).pathname);
});

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);

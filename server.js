import express from "express";
import path from "path";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();
const PORT = 3000;

// public 폴더 서빙
app.use(express.static(path.join(path.resolve(), "public")));

// API 라우트
app.get("/api/dict", async (req, res) => {
  try {
    const API_KEY = process.env.DICT_API_KEY;
    const url = `https://opendict.korean.go.kr/api/search?key=${API_KEY}&type=json&start=1&end=10&query=ㅅㄱ`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("API 호출 실패");
    const data = await response.json();

    const firstCho = data.items[0]?.word?.[0] || "?";
    const secondCho = data.items[0]?.word?.[1] || "?";

    res.json({ firstCho, secondCho });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "서버 호출 실패" });
  }
});

// 메인 페이지 라우트
app.get("/", (req, res) => {
  res.sendFile(path.join(path.resolve(), "public/index.html"));
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);

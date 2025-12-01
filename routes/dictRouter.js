import express from "express";
import { testData, fetchWordsByInitial, checkWord } from "../api/dict.js";

const router = express.Router();

// 랜덤 초성 + 단어 API
router.get("/dict", async (req, res) => {
  const randomIndex = Math.floor(Math.random() * testData.length);
  const selected = testData[randomIndex];
  const words = await fetchWordsByInitial(selected.firstCho, 30);

  res.json({
    firstCho: selected.firstCho,
    secondCho: selected.secondCho,
    words: words.length > 0 ? words : [selected.firstCho], // fallback
  });
});

// 단어 검증 API
router.get("/check-word", async (req, res) => {
  const { word } = req.query;
  if (!word) return res.json({ valid: false });

  const valid = await checkWord(word);
  res.json({ valid });
});

export default router;

import express from "express";
import { chosung, checkWord } from "../api/dict.js";

const router = express.Router();

// 랜덤 초성
router.get("/dict", async (req, res) => {
  const firstCho = chosung[Math.floor(Math.random() * chosung.length)];
  const secondCho = chosung[Math.floor(Math.random() * chosung.length)];

  res.json({ firstCho: firstCho, secondCho: secondCho });
});

// 단어 검증 API
router.get("/check-word", async (req, res) => {
  const { word } = req.query;
  if (!word) return res.json({ valid: false });

  const valid = await checkWord(word);
  res.json({ valid });
});

export default router;

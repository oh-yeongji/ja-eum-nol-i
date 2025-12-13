import dotenv from "dotenv";
dotenv.config();
import express from "express";
import axios from "axios";
import { chosung, checkWord } from "../api/dict.js";

const router = express.Router();

const API_KEY = process.env.KORDIC_API_KEY;

// 랜덤 초성
router.get("/dict", (req, res) => {
  const firstCho = chosung[Math.floor(Math.random() * chosung.length)];
  const secondCho = chosung[Math.floor(Math.random() * chosung.length)];

  res.json({ firstCho, secondCho });
});

// 단어 검증 API
router.get("/check-word", async (req, res) => {
  const word = req.query.word?.trim();

  const validHangul = /^[가-힣]{2}$/;
  if (!validHangul.test(word)) {
    return res.json({
      valid: false,
      reason: "format_error",
      message: "완성형 한글 두 글자만 입력",
    });
  }

  try {
    const url =
      `https://stdict.korean.go.kr/api/search.do` +
      `?key=${API_KEY}` +
      `&type_search=search` +
      `&req_type=json` +
      `&q=${encodeURIComponent(word)}`;

    const dictRes = await axios.get(url);

    const items = dictRes.data?.channel?.item ?? [];
    const exists = items.length > 0;

    if (!exists) {
      return res.json({
        valid: false,
        reason: "not_found",
        items: [],
      });
    }

    // ✨ 가공 로직 추가
    const processedItems = items.map((item) => {
      const senses = item.sense;

      // sense가 객체인데 배열로 감싸야 하는 경우
      const senseArray = Array.isArray(senses)
        ? senses
        : senses
        ? [senses]
        : [];

      const definitions = senseArray.map((s) => ({
        definition: s.definition || s.definition_original || "",
        pos: s.pos || "",
      }));

      return {
        word: item.word,
        pos: item.pos || "",
        definitions,
      };
    });

    return res.json({
      valid: true,
      reason: "ok",
      items: processedItems,
    });
  } catch (err) {
    console.error("🔥 사전 API 에러:", err.message);
    return res.json({
      valid: false,
      reason: "server_error",
    });
  }
});

export default router;

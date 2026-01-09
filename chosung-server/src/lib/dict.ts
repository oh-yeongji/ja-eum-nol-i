import { XMLParser } from "fast-xml-parser";
import dotenv from "dotenv";
dotenv.config();
export const chosung = [
  "ㄱ",
  "ㄴ",
  "ㄷ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅅ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

// 입력 단어 검증
export async function checkWord(word: string): Promise<boolean> {
  if (!word || typeof word !== "string") return false;

  const API_KEY = process.env.KORDIC_API_KEY;

  if (!API_KEY) return false;

  const url = `https://stdict.korean.go.kr/api/search.do?key=${API_KEY}&type_search=search&req_type=xml&q=${encodeURIComponent(
    word
  )}`;

  const res = await fetch(url);
  const raw = await res.text();

  if (!raw.trim()) return false;

  const parser = new XMLParser();
  const data = parser.parse(raw);

  const total = Number(data?.channel?.total ?? 0);
  return total > 0;
}

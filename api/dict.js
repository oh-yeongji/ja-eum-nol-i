import { XMLParser } from "fast-xml-parser";

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
export async function checkWord(word) {
  const API_KEY = process.env.KORDIC_API_KEY;

  const url = `https://stdict.korean.go.kr/api/search.do?key=${API_KEY}&type_search=search&q=${encodeURIComponent(
    word
  )}`;

  const res = await fetch(url);
  const raw = await res.text();
  console.log("API RESPONSE RAW:", raw.slice(0, 200));

  if (!raw || raw.trim() === "") return false;

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });

  let data;
  try {
    data = parser.parse(raw);
  } catch (err) {
    console.error("XML 파싱 오류:", err, "원본:", raw);
    return false;
  }

  const items = data?.channel?.item;

  // item이 배열이거나 단일 객체일 수 있음 → 둘 다 처리
  if (!items) return false;

  if (Array.isArray(items)) return items.length > 0;
  else return true; // 단일 item도 단어 존재하는 경우
}

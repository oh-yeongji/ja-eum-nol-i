import { XMLParser } from "fast-xml-parser";
import dotenv from "dotenv";
dotenv.config();

interface DictCheckResult {
  exist: boolean;
  isNoun: boolean;
}

// 입력 단어 검증
export async function checkWordDetail(word: string): Promise<DictCheckResult> {
  if (!word || typeof word !== "string") return { exist: false, isNoun: false };

  const API_KEY = process.env.KORDIC_API_KEY;

  if (!API_KEY) return { exist: false, isNoun: false };

  const url = `https://stdict.korean.go.kr/api/search.do?key=${API_KEY}&type_search=search&req_type=xml&q=${encodeURIComponent(
    word
  )}`;
  try {
    const res = await fetch(url);
    const raw = await res.text();

    if (!raw.trim()) return { exist: false, isNoun: false };

    const parser = new XMLParser({ ignoreAttributes: false });
    const data = parser.parse(raw);

    const total = Number(data?.channel?.total ?? 0);
    if (total === 0) return { exist: false, isNoun: false };

    //단일 객체인지 배열인지 확인
    const items = Array.isArray(data.channel.item)
      ? data.channel.item // 배열이 맞으면 그대로
      : [data.channel.item]; // 단일 객체이면 배열 씌우기

    const firstItem = items[0];

    // 명사만 가능
    const isNoun = firstItem.pos === "명사";
    return {
      exist: true,
      isNoun,
    };
  } catch (err) {
    console.error("checkWordDetail  error", err);
    return { exist: false, isNoun: false };
  }
}

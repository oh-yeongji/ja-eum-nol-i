import { XMLParser } from "fast-xml-parser";
import dotenv from "dotenv";
dotenv.config();

interface DictCheckResult {
  exist: boolean;
  definitions: string[];
}

export async function checkWordDetail(word: string): Promise<DictCheckResult> {
  const failResult: DictCheckResult = { exist: false, definitions: [] };

  if (!word || typeof word !== "string") return failResult;

  const API_KEY = process.env.KORDIC_API_KEY;
  if (!API_KEY) {
    console.error("API 키가 설정되지 않았습니다.");
    return failResult;
  }

  const url = `https://stdict.korean.go.kr/api/search.do?key=${API_KEY}&type_search=search&req_type=xml&q=${encodeURIComponent(word)}`;

  try {
    const res = await fetch(url);
    const raw = await res.text();

    if (!raw.trim()) return failResult;

    const parser = new XMLParser({ ignoreAttributes: false });
    const data = parser.parse(raw);

    const total = Number(data?.channel?.total ?? 0);
    if (total === 0) return failResult;

    const rawItems = data.channel.item;
    const items = Array.isArray(rawItems) ? rawItems : [rawItems];

    const allDefinitions: string[] = items.map((item: any) => {
      const def = item.sense?.definition || item.definition || "뜻 정보 없음";
      return typeof def === "string"
        ? def.replace(/<[^>]*>?/gm, "")
        : "뜻 정보 없음";
    });

    return {
      exist: true,
      definitions: allDefinitions,
    };
  } catch (err) {
    console.error("checkWordDetail error:", err);
    return failResult;
  }
}

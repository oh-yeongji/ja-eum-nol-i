export const testData = [
  { firstCho: "ㄱ", secondCho: "ㅅ" },
  { firstCho: "ㅁ", secondCho: "ㄴ" },
  { firstCho: "ㅂ", secondCho: "ㅈ" },
  { firstCho: "ㅎ", secondCho: "ㄹ" },
];

// 랜덤 초성 + 단어 가져오기
export async function fetchWordsByInitial(initial, limit = 30) {
  const API_KEY = process.env.KORDIC_API_KEY;
  const url = `https://stdict.korean.go.kr/api/search.do?key=${API_KEY}&type_search=initial&req_type=json&part=2&num=${limit}&q=${initial}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("API 호출 실패");

    const data = await res.json();
    const items = data?.channel?.item || [];
    const words = items.map((it) => it.word).filter(Boolean);

    return words.length > 0 ? words : [];
  } catch (err) {
    console.error("API 호출 오류:", err);
    return [];
  }
}

// 입력 단어 검증
export async function checkWord(word) {
  const API_KEY = process.env.KORDIC_API_KEY;

  const url = `https://stdict.korean.go.kr/api/search.do?key=${API_KEY}&type_search=search&req_type=json&q=${encodeURIComponent(
    word
  )}`;

  const res = await fetch(url);
  const raw = await res.text();
  console.log("RAW 응답:", raw.substring(0, 200));

  // 응답이 비었으면 false
  if (!raw || raw.trim() === "") return false;

  // 1) JSON 파싱 시도
  try {
    const data = JSON.parse(raw);
    if (data.channel && data.channel.item && data.channel.item.length > 0) {
      return true;
    }
  } catch (err) {
    // JSON 파싱 실패 → XML로 넘어감
  }

  // 2) XML 파싱 fallback
  const parser = new DOMParser();
  const xml = parser.parseFromString(raw, "application/xml");
  const items = xml.getElementsByTagName("item");

  return items.length > 0;
}

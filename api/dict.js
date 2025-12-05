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

  const url = `https://stdict.korean.go.kr/api/search.do?key=${API_KEY}&type_search=search&req_type=json&q=${encodeURIComponent(
    word
  )}`;

  const res = await fetch(url);
  const raw = await res.text();


  // 응답이 비었으면 false
  if (!raw || raw.trim() === "") return false;

  // 1) JSON 파싱 시도
  try {
    const data = JSON.parse(raw);
    if (data.channel && data.channel.item && data.channel.item.length > 0) {
      return true;
    }
  } catch (err) {

  }


  return false;
}

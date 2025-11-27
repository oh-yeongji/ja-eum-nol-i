// pages/api/dict.js
export default async function handler(req, res) {
  const API_KEY = process.env.KORDIC_API_KEY;
  const url = `https://stdict.korean.go.kr/api/search.do?key=${API_KEY}&type_search=initial&req_type=json&part=2&num=1`;

  try {
    const response = await fetch(url);
    if (!response.ok)
      return res.status(response.status).json({ error: "API 호출 실패" });

    const data = await response.json();
    const items = data?.channel?.item || [];
    const word = items[0]?.word || "";

    res
      .status(200)
      .json({ firstCho: word[0] || "?", secondCho: word[1] || "?" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "서버 오류" });
  }
}

export default async function handler(req, res) {
  const API_KEY = process.env.KORDIC_API_KEY;
  console.log("API_KEY:", API_KEY); // ✅ 환경 변수 출력

  const url = `https://stdict.korean.go.kr/api/search.do?key=${API_KEY}&type_search=initial&req_type=json&part=2&num=1`;
  console.log("Fetch URL:", url); // ✅ 호출 URL 확인

  try {
    const response = await fetch(url);
    console.log("Response status:", response.status); // ✅ HTTP 상태 코드 출력

    if (!response.ok) {
      const text = await response.text();
      console.error("API 호출 실패, 응답 본문:", text); // ✅ 실패 시 body 확인
      return res.status(response.status).json({ error: "API 호출 실패" });
    }

    const data = await response.json();
    console.log("Data received:", data); // ✅ 데이터 확인

    const items = data?.channel?.item || [];
    const word = items[0]?.word || "";

    res
      .status(200)
      .json({ firstCho: word[0] || "?", secondCho: word[1] || "?" });
  } catch (err) {
    console.error("Server error:", err); // ✅ 예외 발생 시 에러 출력
    res.status(500).json({ error: "서버 오류" });
  }
}

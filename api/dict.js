export default async function handler(req, res) {
  const word = req.query.word || "";
  const apiKey = process.env.OPEN_DICT_KEY; 

  const url = `https://opendict.korean.go.kr/api/search?key=${apiKey}&q=${encodeURIComponent(
    word
  )}&req_type=json`;

  try {
    const response = await fetch(url);
    const data = await response.text(); 
    res.status(200).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "API 요청 실패" });
  }
}

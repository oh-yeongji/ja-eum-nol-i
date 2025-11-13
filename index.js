const startBtn = document.querySelector(".startBtn");
const gameScreen = document.querySelector(".gameScreen");
const dim = document.querySelector(".dim");
const chosungLoad = document.querySelector(".chosungLoad");
startBtn.onclick = function () {
  gameScreen.style.display = "block";
  dim.style.display = "block";
};

dim.onclick = function () {
  gameScreen.style.display = "none";
  dim.style.display = "none";
};

chosungLoad.onclick = function () {
  const apiKey = "YOUR_API_KEY";
  const word = "사랑";
  const url = `https://opendict.korean.go.kr/api/search?key=${apiKey}&q=${encodeURIComponent(
    word
  )}&req_type=json`;

  fetch(url)
    .then((res) => res.text())
    .then(console.log)
    .catch(console.error);
};

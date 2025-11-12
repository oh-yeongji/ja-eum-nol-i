const startBtn = document.querySelector(".startBtn");
const gameScreen = document.querySelector(".gameScreen");
const dim = document.querySelector(".dim");
startBtn.onclick = function () {
  gameScreen.style.display = "block";
  dim.style.display = "block";
};

dim.onclick = function () {
  gameScreen.style.display = "none";
  dim.style.display = "none";
};

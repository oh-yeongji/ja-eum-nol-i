const startBtn = document.querySelector(".startBtn");
const dim = document.querySelector(".dim");
const gameSettings = document.querySelector(".gameSettings");
const gameSettingsIcon = document.querySelector(".gameSettings > i");
// 시간설정
const timeSetting = document.querySelector(".timeSetting  i");
// 게임 설명
const gameInfo = document.querySelector(".gameInfo  i");
const gameScreen = document.querySelector(".gameScreen");
const chosungLoad = document.querySelector(".chosungLoad");

startBtn.onclick = function () {
  gameScreen.style.display = "block";
  dim.style.display = "block";
};

dim.onclick = function () {
  gameScreen.style.display = "none";
  dim.style.display = "none";
};

gameSettings.addEventListener("click", function () {
  gameSettings.classList.toggle("expanded");
});

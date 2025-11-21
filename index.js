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
 
  gameSettings.style.width = "150px";
  gameSettings.style.borderRadius = "20px";
  // 눌렀을때 톱니
  gameSettingsIcon.style.top = "25px";
  gameSettingsIcon.style.left = "25px";

  timeSetting.style.position = "absolute";
  timeSetting.style.display = "block";
  timeSetting.style.top = "20%";
  timeSetting.style.left = "40%";

  gameInfo.style.position = "absolute";
  gameInfo.style.display = "block";
  gameInfo.style.top = "20%";
  gameInfo.style.left = "75%";
});

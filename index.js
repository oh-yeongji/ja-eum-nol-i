const startBtn = document.querySelector(".startBtn");
const dim = document.querySelector(".dim");
const gameSettings = document.querySelector(".gameSettings");
const gameSettingsIcon = document.querySelector(".gameSettings > i");
// 시간설정
const timeSetting = document.querySelector(".timeSetting > i");
// 시간설정모달창
const timeModal = document.querySelector(".timeModal");

//모달창 클로즈 버튼
const timeModalCloseBtn = document.querySelector(".closeBtn");

// 게임 설명
const gameInfo = document.querySelector(".gameInfo > i");
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

gameSettings.addEventListener("click", (e) => {
  // 시간 설정 아이콘 눌렀을 때는 gear 토글 방지
  if (e.target.closest(".timeSetting")) return;

  // 게임 설명 아이콘 눌렀을 때도 gear 토글 방지
  if (e.target.closest(".gameInfo")) return;

  gameSettings.classList.toggle("expanded");
});

timeSetting.addEventListener("click", (e) => {
  e.stopPropagation();
  timeModal.classList.add("active");
});

timeModalCloseBtn.addEventListener("click", function () {
  timeModal.classList.remove("active");
});

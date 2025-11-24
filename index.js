document.addEventListener("DOMContentLoaded", () => {
  const dim = document.querySelector(".dim");
  const gameSettings = document.querySelector(".gameSettings");
  const gameSettingsIcon = document.querySelector(".gameSettings > i");
  // 시간설정
  const timeSetting = document.querySelector(".timeSetting > i");
  // 시간설정모달창
  const timeModal = document.querySelector(".timeModal");

  //시간 슬라이드
  const slide = document.querySelector(".timeSlide");

  // 시간슬라이드 이전 버튼
  const prev = document.querySelector(".prev");

  // 시간슬라이드 다음 버튼
  const next = document.querySelector(".next");

  //infoIcon
  const gameInfo = document.querySelector(".gameInfo > i");
  //infoModal
  const gameInfoModal = document.querySelector(".gameInfoModal");
  //입장하기 버튼
  const enterRoomBtn = document.querySelector(".enterRoomBtn");
  //게임 스크린
  const gameScreen = document.querySelector(".gameScreen");

  //초성추출 버튼이지만 안할거임 시작하기로 할거임
  const chosungLoad = document.querySelector(".chosungLoad");

  dim.onclick = function () {
    gameScreen.style.display = "none";
    dim.style.display = "none";
  };

  gameSettingsIcon.addEventListener("click", (e) => {
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

  document
    .querySelector(".timeCloseBtn")
    .addEventListener("click", function () {
      timeModal.classList.remove("active");
    });

  gameInfo.addEventListener("click", (e) => {
    e.stopPropagation();
    gameInfoModal.classList.add("active");
  });

  document
    .querySelector(".gameInfoCloseBtn")
    .addEventListener("click", function () {
      gameInfoModal.classList.remove("active");
    });

  let currentIndex = 0;
  const slideCount = slide.children.length;
  const slideWidth = 200;

  //이전버튼

  prev.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      slide.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    }
  });

  //다음버튼
  next.addEventListener("click", () => {
    if (currentIndex < slideCount - 1) {
      currentIndex++;
      slide.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    }
  });

  //입장하기 버튼
  enterRoomBtn.onclick = function () {
    gameScreen.style.display = "block";
    dim.style.display = "block";
  };
});

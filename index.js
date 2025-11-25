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
  const gameRoom = document.querySelector(".gameRoom");

  //input창
  const input = document.querySelector(".input");

  //입력 버튼
  const enter = document.querySelector(".enter");
  const p1Chat = document.querySelector(".p1Chat");

  // 시작하기로 할거임
  const startBtn = document.querySelector(".startBtn");

  dim.onclick = function () {
    gameRoom.style.display = "none";
    dim.style.display = "none";
  };

  gameSettingsIcon.addEventListener("click", (e) => {

    if (e.target.closest(".timeSetting")) return;

 
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
    gameRoom.style.display = "block";
    dim.style.display = "block";
  };

  //input에 넣은거 입력버튼 누르면 채팅창에 뜨게끔
  enter.addEventListener("click", function () {
    p1Chat.style.marginTop = "40px";
    p1Chat.style.marginLeft = "50px";

    p1Chat.style.width = "150px";
    p1Chat.style.height = "55px";
    p1Chat.style.background = "#ccc";
    p1Chat.style.opacity = "0.5";
    p1Chat.style.borderRadius = "20px";
    p1Chat.style.lineHeight = "55px";

    const inputValue = input.value;
    p1Chat.innerHTML = inputValue;
    input.value = "";
  });
});

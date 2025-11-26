document.addEventListener("DOMContentLoaded", () => {
  const dim = document.querySelector(".dim");
  const gameSettings = document.querySelector(".gameSettings");
  const gameSettingsIcon = document.querySelector(".gameSettings > i");
  const timeSetting = document.querySelector(".timeSetting > i");
  const timeModal = document.querySelector(".timeModal");
  const slide = document.querySelector(".timeSlide");
  const prev = document.querySelector(".prev");
  const next = document.querySelector(".next");
  const gameInfo = document.querySelector(".gameInfo > i");
  const gameInfoModal = document.querySelector(".gameInfoModal");
  const enterRoomBtn = document.querySelector(".enterRoomBtn");
  const gameRoom = document.querySelector(".gameRoom");
  const input = document.querySelector(".input");
  const enter = document.querySelector(".enter");
  const p1Chat = document.querySelector(".p1Chat");
  const startBtn = document.querySelector(".startBtn");

  // --- 기존 UI 이벤트들 ---
  dim.onclick = () => {
    gameRoom.style.display = "none";
    dim.style.display = "none";
  };
  gameSettingsIcon.addEventListener("click", (e) => {
    if (e.target.closest(".timeSetting") || e.target.closest(".gameInfo"))
      return;
    gameSettings.classList.toggle("expanded");
  });
  timeSetting.addEventListener("click", (e) => {
    e.stopPropagation();
    timeModal.classList.add("active");
  });
  document
    .querySelector(".timeCloseBtn")
    .addEventListener("click", () => timeModal.classList.remove("active"));
  gameInfo.addEventListener("click", (e) => {
    e.stopPropagation();
    gameInfoModal.classList.add("active");
  });
  document
    .querySelector(".gameInfoCloseBtn")
    .addEventListener("click", () => gameInfoModal.classList.remove("active"));
  let currentIndex = 0;
  const slideCount = slide.children.length;
  const slideWidth = 200;
  prev.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      slide.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    }
  });
  next.addEventListener("click", () => {
    if (currentIndex < slideCount - 1) {
      currentIndex++;
      slide.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    }
  });
  enterRoomBtn.onclick = () => {
    gameRoom.style.display = "block";
    dim.style.display = "block";
  };
  enter.addEventListener("click", () => {
    p1Chat.style.marginTop = "40px";
    p1Chat.style.marginLeft = "50px";
    p1Chat.style.width = "150px";
    p1Chat.style.height = "55px";
    p1Chat.style.background = "#ccc";
    p1Chat.style.opacity = "0.5";
    p1Chat.style.borderRadius = "20px";
    p1Chat.style.lineHeight = "55px";
    p1Chat.innerHTML = input.value;
    input.value = "";
  });

  async function getChosung() {
    try {
      const res = await fetch("/api/dict");
      if (!res.ok) throw new Error("API 호출 실패");
      const data = await res.json();

      // 초성 한 칸씩 넣기
      document.querySelector(".firstCho").textContent = data.firstCho;
      document.querySelector(".secondCho").textContent = data.secondCho;
    } catch (err) {
      console.error(err);
    }
  }

  // 시작 버튼 클릭 시
  document.querySelector(".startBtn").addEventListener("click", getChosung);

  // 기존 코드 그대로 사용 가능
});

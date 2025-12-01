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
  const wordInput = document.querySelector(".wordInput");
  //입력
  const submitBtn = document.querySelector(".submitBtn");
  const firstCho = document.querySelector(".firstCho");
  const secondCho = document.querySelector(".secondCho");

  const p1Chat = document.querySelector(".p1Chat");
  const startBtn = document.querySelector(".startBtn");


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

  //입력 버튼
  submitBtn.addEventListener("click", async () => {
    const word = wordInput.value.trim();
    if (!word) return;

    // 서버 요청 먼저
    const res = await fetch(`/api/check-word?word=${encodeURIComponent(word)}`);
    const data = await res.json();

    if (!data.valid) {
      // 존재하지 않는 단어 → UI 건들지 말 것
      alert("존재하지않는단어입니다.");
      return;
    }

    // 유효한 단어일 때만 UI 표시
    p1Chat.style.marginTop = "40px";
    p1Chat.style.marginLeft = "50px";
    p1Chat.style.width = "150px";
    p1Chat.style.height = "55px";
    p1Chat.style.background = "#ccc";
    p1Chat.style.opacity = "0.5";
    p1Chat.style.borderRadius = "20px";
    p1Chat.style.lineHeight = "55px";
    p1Chat.style.display = "block";
    p1Chat.innerHTML = word;

    wordInput.value = "";
  });

  async function getChosung() {
    const res = await fetch("/api/dict");
    const data = await res.json();
    document.querySelector(".firstCho").textContent = data.firstCho;
    document.querySelector(".secondCho").textContent = data.secondCho;
  }

  document.querySelector(".startBtn").addEventListener("click", getChosung);
});

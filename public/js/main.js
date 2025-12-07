document.addEventListener("DOMContentLoaded", () => {
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

  const p1ChatList = document.querySelector(".p1ChatList");
  const startBtn = document.querySelector(".startBtn");

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
  //입력 함수
  const handleSubmit = async () => {
    const word = wordInput.value.replace(/\s/g, "");
    const char = Array.from(word);
    console.log(char);

    if (!char || char.length !== 2) {
      const alertModal = document.querySelector(".invalidWordModal");
      alertModal.innerText = "두 글자만 입력 가능합니다.";
      alertModal.classList.add("active");

      setTimeout(() => alertModal.classList.remove("active"), 1500);

      return;
    }

    // 서버 요청 먼저
    const res = await fetch(`/api/check-word?word=${encodeURIComponent(word)}`);
    const data = await res.json();

    if (!data.valid) {
      const alertModal = document.querySelector(".invalidWordModal");
      alertModal.classList.add("active");

      setTimeout(() => alertModal.classList.remove("active"), 1500);

      return;
    }

    const newChat = document.createElement("div");
    newChat.classList.add("newChat");
    newChat.textContent = word;
    p1ChatList.appendChild(newChat);

    wordInput.value = "";

    p1ChatList.scrollTop = p1ChatList.scrollHeight;
  };

  //입력 버튼클릭
  submitBtn.addEventListener("click", handleSubmit);
  wordInput.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  });

  async function getChosung() {
    const res = await fetch("/api/dict");
    const data = await res.json();
    document.querySelector(".firstCho").textContent = data.firstCho;
    document.querySelector(".secondCho").textContent = data.secondCho;
  }

  startBtn.addEventListener("click", getChosung);
});

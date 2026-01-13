import { useEffect, useState } from "react";
import { socket } from "@/socket/socket";
import { checkWord } from "@api/game";
import styles from "./CenterPlay.module.css";

interface CenterPlayProps {
  addPlayerWord: (word: string) => void;
}

const CenterPlay = ({ addPlayerWord }: CenterPlayProps) => {
  const [word, setWord] = useState("");
  const [alert, setAlert] = useState<string | null>(null);

  const [firstCho, setFirstCho] = useState("?");
  const [secondCho, setSecondCho] = useState("?");

  const [usedWords, setusedWords] = useState<Set<string>>(new Set());

  const showAlert = (msg: string) => {
    setAlert(msg);
    setTimeout(() => setAlert(null), 1500);
  };

  useEffect(() => {
    socket.connect();

    socket.emit("join-room", { uesrId: "tset-user", nickname: "아무개" });

    socket.on("countdown-start", ({ seconds }) => {
      console.log("카운트다운 시작:", seconds);
    });

    socket.on("game-start", ({ chosungPair }) => {
      setFirstCho(chosungPair[0]);
      setSecondCho(chosungPair[1]);
    });

    socket.on("word-result", (res) => {
      if (res.valid) {
        addPlayerWord(res.word);
        setusedWords((prev) => new Set([...prev, res.word]));
      } else {
        showAlert(res.reason);
      }
    });

    return () => {
      socket.off("countdown-start");
      socket.off("game-start");
      socket.off("word-result");
    };
  }, []);

  const handleSubmit = () => {
    const trimmed = word.trim();
    // 1. 두글자 검사
    if (!/^[가-힣]{2}$/.test(trimmed)) {
      showAlert("두 글자 한글만 입력 가능합니다.");
      return;
    }
    // 2. 중복검사
    if (usedWords.has(trimmed)) {
      showAlert("이미 사용한 단어입니다.");
      return;
    }

    socket.emit("submit-word", { word: trimmed });
    setWord("");
  };

  return (
    <div className={styles.centerWrapper}>
      <div className={styles.chosungContainer}>
        <div className={styles.chosungScreen}>
          <div className={styles.firstCho}>{firstCho}</div>
          <div className={styles.secondCho}>{secondCho}</div>
        </div>

        <div className={styles.inputContainer}>
          {alert && <div className={styles.chosungAlert}>{alert}</div>}

          <div className={styles.inputGroup}>
            <input
              type="text"
              className={styles.wordInput}
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <div className={styles.submitBtn} onClick={handleSubmit}>
              Enter
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CenterPlay;

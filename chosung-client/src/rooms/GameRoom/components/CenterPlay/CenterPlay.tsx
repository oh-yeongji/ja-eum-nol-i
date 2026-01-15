import { useEffect, useState } from "react";
import { socket } from "@/socket/socket";
import { checkWord } from "@api/game";
import styles from "./CenterPlay.module.css";

interface CenterPlayProps {}

interface WordResult {
  word: string;
  valid: boolean;
  reason?: string;
  senderId: string;
}

const CenterPlay = () => {
  const [word, setWord] = useState("");
  const [alert, setAlert] = useState<string | null>(null);

  const [firstCho, setFirstCho] = useState("?");
  const [secondCho, setSecondCho] = useState("?");

  const [lastResult, setLastResult] = useState<WordResult | null>(null);

  const showAlert = (msg: string) => {
    setAlert(msg);
    setTimeout(() => setAlert(null), 1500);
  };


  useEffect(() => {
    socket.on("connect_error", (err) => {
      console.error("socket error:", err.message);
    });

    socket.on("countdown-start", ({ seconds }) => {
      console.log("카운트다운 시작:", seconds);
    });

    socket.on("game-start", ({ chosungPair }) => {
      console.log("🎮 game-start received:", chosungPair);

      setFirstCho(chosungPair[0]);
      setSecondCho(chosungPair[1]);
    });

    socket.on("word-result", ({ word, valid, reason, senderId }) => {
      console.log("📨 word-result:", { word, valid, reason, senderId });
      setLastResult({ word, valid, reason, senderId });

      if (!valid && reason) {
        showAlert(reason);
      }
    });

    return () => {
      socket.off("connect_error");
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
    console.log("emit submit-word:", word);
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

          {lastResult && (
            <div className={styles.resultBox}>
              <div>단어: {lastResult.word}</div>
              <div>결과: {lastResult.valid ? "⭕ 성공" : "❌ 실패"}</div>
              {lastResult.reason && <div>{lastResult.reason}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CenterPlay;

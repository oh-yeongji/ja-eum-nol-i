import { useState } from "react";
import { checkWord } from "@api/game";
import styles from "./CenterPlay.module.css";
import Timer from "./Timer";

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

  const handleSubmit = async () => {
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

    try {
      const res = await checkWord(word.trim());

      if (res.valid) {
        addPlayerWord(trimmed); // 부모 컴포넌트로 올리는용

        //입력 UX용 중복 방지
        setusedWords((prev) => new Set(prev).add(trimmed)); // ux최적화용
      } else {
        showAlert("존재하지않는 단어입니다.");
      }
      setWord("");
    } catch (e) {
      console.error("checkWord error:", e);
    }
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

      <Timer />
    </div>
  );
};
export default CenterPlay;

import { useState } from "react";
import styles from "./CenterPlay.module.css";

import Timer from "./Timer";
const CenterPlay = () => {
  const [word, setWord] = useState("");
  const [alert, setAlert] = useState<string | null>(null);

  const [firstCho, setFirstCho] = useState("?");
  const [secondCho, setSecondCho] = useState("?");

  const showAlert = (msg: string) => {
    setAlert(msg);
    setTimeout(() => setAlert(null), 1500);
  };

  const handleSubmit = async () => {
    const trimmed = word.replace(/\s/g, "");
    if (trimmed.length === 0) {
      showAlert("단어를 입력하세요");
      return;
    }

    if (!/^[가-힣]+$/.test(trimmed)) {
      showAlert("잘못된 단어입니다.");
      return;
    }

    if (trimmed.length !== 2) {
      showAlert("두 글자만 입력 가능합니다.");
      return;
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

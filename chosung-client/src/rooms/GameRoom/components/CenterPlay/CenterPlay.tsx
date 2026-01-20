import { useEffect, useState } from "react";
import { checkWord } from "@api/game";
import styles from "./CenterPlay.module.css";
import Timer from "../Timer";

interface Props {
  chosungPair: [string, string];
  lastResult: {
    word: string;
    valid: boolean;
    reason?: string;
    senderId: string;
  } | null;
  onSubmitWord: (word: string) => void;
  timeLeftMs: number;
}

const CenterPlay = ({
  chosungPair,
  lastResult,
  onSubmitWord,
  timeLeftMs,
}: Props) => {
  const [word, setWord] = useState("");
  const [alert, setAlert] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);

  const isTimeOver = timeLeftMs <= 0;

  const showAlert = (msg: string) => {
    setAlert(msg);
    setTimeout(() => setAlert(null), 1500);
  };

  const handleSubmit = () => {
    const trimmed = word.trim();
    if (!trimmed) {
      showAlert("단어를 입력하세요");
      setWord("");
      return;
    }
    onSubmitWord(trimmed);
    setWord("");

    if (isTimeOver) return;
  };

  useEffect(() => {
    if (lastResult && !lastResult.valid && lastResult.reason) {
      showAlert(lastResult.reason);
    }
  }, [lastResult]);

  return (
    <div className={styles.centerWrapper}>
      <div className={styles.chosungContainer}>
        <div className={styles.chosungScreen}>
          <div className={styles.firstCho}>{chosungPair[0]}</div>
          <div className={styles.secondCho}>{chosungPair[1]}</div>
        </div>

        <div className={styles.inputContainer}>
          {alert && <div className={styles.chosungAlert}>{alert}</div>}

          <div className={styles.inputGroup}>
            <input
              type="text"
              className={styles.wordInput}
              value={word}
              disabled={isTimeOver}
              onChange={(e) => setWord(e.target.value)}
              onKeyDown={(e) => {
                e.key === "Enter" && handleSubmit();
                if (isTimeOver) return;
              }}
            />
            <div
              className={styles.submitBtn}
              onClick={() => {
                if (isTimeOver) return;
                handleSubmit();
              }}
            >
              Enter
            </div>
          </div>
          <Timer timeLeftMs={timeLeftMs} />
        </div>
      </div>
    </div>
  );
};
export default CenterPlay;

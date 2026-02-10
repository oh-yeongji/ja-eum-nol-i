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
  state: string;
}

const CenterPlay = ({
  chosungPair,
  lastResult,
  onSubmitWord,
  timeLeftMs,
  state,
}: Props) => {
  const [word, setWord] = useState("");
  const [alert, setAlert] = useState<string | null>(null);

  const isTimeOver = state !== "PLAY" || timeLeftMs <= 0;

  const showAlert = (msg: string) => {
    setAlert(msg);
    setTimeout(() => setAlert(null), 1500);
  };

  const handleSubmit = () => {
    if (isTimeOver) return;
    const trimmed = word.trim();
    if (!trimmed) {
      showAlert("단어를 입력하세요");
      setWord("");
      return;
    }

    if (trimmed.length !== 2) {
      showAlert("두 단어만 입력하세요.");
      setWord("");
      return;
    }

    onSubmitWord(trimmed);
    setWord("");
  };

  useEffect(() => {
    if (lastResult && !lastResult.valid && lastResult.reason) {
      showAlert(lastResult.reason);
    }
  }, [lastResult]);

  return (
    <div className={styles.centerWrapper}>
      <Timer timeLeftMs={timeLeftMs} />
      <div className={styles.chosungContainer}>
        <div className={styles.chosungScreen}>
          <div className={styles.firstCho}>{chosungPair[0]}</div>
          <div className={styles.secondCho}>{chosungPair[1]}</div>
        </div>

        {alert && <div className={styles.chosungAlert}>{alert}</div>}
        <div className={styles.inputContainer}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              className={styles.wordInput}
              value={word}
              disabled={isTimeOver}
              onChange={(e) => setWord(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.nativeEvent.isComposing) return;
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
            <button
              type="button"
              className={styles.submitBtn}
              onClick={() => {
                if (isTimeOver) return;
                handleSubmit();
              }}
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CenterPlay;

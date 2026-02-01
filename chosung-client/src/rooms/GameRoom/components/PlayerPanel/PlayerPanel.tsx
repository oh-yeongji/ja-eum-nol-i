import styles from "./PlayerPanel.module.css";

interface PlayerPanelProps {
  nickname: string;
  words: string[];
}

const PlayerPanel = ({ nickname, words }: PlayerPanelProps) => {

const currentPage = Math.floor(( words.length - 1) / 5);
const startIndex = currentPage * 5;

const currentWords=words.slice(startIndex , startIndex+5);

  return (
    <div className={styles.playerWrapper}>
      <div className={styles.nickname}>{nickname}</div>
      {currentWords.map((word, idx) => (
        <div
          style={{ width: "200px", height: "100px", background: "#dfdfdf" }}
          key={idx}
        >
          {word}
        </div>
      ))}
    </div>
  );
};

export default PlayerPanel;

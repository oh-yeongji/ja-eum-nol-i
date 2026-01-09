import styles from "./PlayerPanel.module.css";

interface WordsPorps {
  words: string[];
}

const PlayerPanel = ({ words }: WordsPorps) => {
  return (
    <div className={styles.playerWrapper}>
      <div className={styles.nickName}>닉네임</div>
      {words.map((word, idx) => (
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

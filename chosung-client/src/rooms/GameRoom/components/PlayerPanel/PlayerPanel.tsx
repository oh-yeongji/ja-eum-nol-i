import styles from "./PlayerPanel.module.css";

interface PlayerPanelProps {
  nickname: string;
  words: string[];
}

const PlayerPanel = ({ nickname, words }: PlayerPanelProps) => {
  return (
    <div className={styles.playerWrapper}>
      <div className={styles.nickName}>{nickname}</div>
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

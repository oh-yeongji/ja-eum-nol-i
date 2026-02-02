import { useDebugValue, useEffect, useRef } from "react";
import styles from "./PlayerPanel.module.css";

interface PlayerPanelProps {
  nickname: string;
  words: string[];
}

const PlayerPanel = ({ nickname, words }: PlayerPanelProps) => {

const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(scrollRef.current){
      scrollRef.current.scrollTop=scrollRef.current.scrollHeight;
    }
  },[words]);

  return (
    <div className={styles.playerWrapper}>
      <div className={styles.nickname}>{nickname}</div>
     
     <div className={styles.wordListContainer} ref={scrollRef}>
     
      {words.map((word, idx) => (
        <div
         className={styles.wordItem}
          key={idx}
        >
          {word}
        </div>
      ))}

      </div>
    </div>
  );
};

export default PlayerPanel;

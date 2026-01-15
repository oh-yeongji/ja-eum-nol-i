import { useState, useEffect } from "react";
import { socket } from "@/socket/socket";
import PlayerPanel from "./components/PlayerPanel/PlayerPanel";
import CenterPlay from "./components/CenterPlay/CenterPlay";
import { send } from "process";

const GameRoom = () => {
  const [myWords, setMyWords] = useState<string[]>([]);
  const [opponentWords, setOpponentWords] = useState<string[]>([]);

  const handleWordResult = (word: string, senderId: string) => {
    if (!word || senderId) return;

    const isMe = senderId === socket.id;
    if (isMe) {
      setMyWords((prev) => [...prev, word]);
    }

    if (senderId === socket.id) {
      setMyWords((prev) => [...prev, word]);
      console.log("내 단어 추가:", word, "현재 내 단어:", [...myWords, word]);
    } else {
      setOpponentWords((prev) => [...prev, word]);
      console.log("상대단어추가:", word, "현재상대 단어:", [
        ...opponentWords,
        word,
      ]);
    }
  };

  useEffect(() => {
    socket.on("word-result", (res) => {
      handleWordResult(res.word, res.senderId);
    });

    return () => {
      socket.off("word-result");
    };
  }, []);

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "url(/images/마당2.jpg) center / cover no-repeat",
          zIndex: "1",
        }}
      />
      <div
        className="dim"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(250, 250, 250, 0.4)",
          zIndex: "2",
        }}
      />

      <div
        className="stage"
        style={{
          width: "1200px",
          height: "700px",
          display: "flex",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          justifyContent: "space-between",
          background: "#fff",
          borderRadius: "25px",
          overflow: "hidden",
          zIndex: "9",
        }}
      >
        <PlayerPanel words={myWords} />
        <CenterPlay />
        <PlayerPanel words={opponentWords} />
      </div>
    </>
  );
};

export default GameRoom;

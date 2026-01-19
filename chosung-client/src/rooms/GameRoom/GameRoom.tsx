import { useState, useEffect } from "react";
import { socket } from "@/socket/socket";
import PlayerPanel from "./components/PlayerPanel/PlayerPanel";
import CenterPlay from "./components/CenterPlay/CenterPlay";

const GameRoom = () => {
  const [chosungPair, setChosungPair] = useState<[string, string]>(["?", "?"]);
  const [lastResult, setLastResult] = useState<any>(null);

  const [myWords, setMyWords] = useState<string[]>([]);
  const [opponentWords, setOpponentWords] = useState<string[]>([]);

  const handleWordResult = (word: string, senderId: string) => {
    console.log("비교:", senderId, socket.id, senderId === socket.id);

    if (!word || !senderId) return;

    if (senderId === socket.id) {
      setMyWords((prev) => {
        const next = [...prev, word];
        console.log("내 단어 next:", next);
        return next;
      });
    } else {
      setOpponentWords((prev) => {
        const next = [...prev, word];
        console.log("상대 단어 next:", next);
        return next;
      });
    }
  };

  useEffect(() => {
    socket.on("game-start", ({ chosungPair }) => {
      setChosungPair(chosungPair);
    });

    socket.on("word-validated", (res) => {
      setLastResult(res);

      if (!res.valid) return;
      handleWordResult(res.word, res.senderId);
    });

    return () => {
      socket.off("game-start");
      socket.off("word-validated");
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
        <PlayerPanel key="me" words={myWords} />
        <CenterPlay
          chosungPair={chosungPair}
          lastResult={lastResult}
          onSubmitWord={(word) => socket.emit("submit-word", { word })}
        />
        <PlayerPanel key="opponent" words={opponentWords} />
      </div>
    </>
  );
};

export default GameRoom;

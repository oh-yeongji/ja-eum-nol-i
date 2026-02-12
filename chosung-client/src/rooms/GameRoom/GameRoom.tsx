import { useState, useEffect } from "react";
import { socket } from "@/socket/socket";
import styles from "./GameRoom.module.css";
import PlayerPanel from "./components/PlayerPanel/PlayerPanel";
import CenterPlay from "./components/CenterPlay/CenterPlay";
import ResultModal from "./components/ResultModal";
import CommonHeader from "./components/CommonHeader/CommonHeader";

import type {
  RoomStatus,
  PlayerSnapshot,
  GameEndData,
} from "@/types/domain/room";

interface GameRoomProps {
  timeLimit: number;
}

const GameRoom = ({ timeLimit }: GameRoomProps) => {
  const [roomData, setRoomData] = useState<{
    players: PlayerSnapshot[];
    myId: string;
    myScore: number;
  }>({
    players: [], //둘을 같이 받기때문
    myId: "",
    myScore: 0,
  });

  const [state, setState] = useState<RoomStatus>("WAIT");

  const [chosungPair, setChosungPair] = useState<[string, string]>(["?", "?"]);
  const [lastResult, setLastResult] = useState<any>(null);

  const [myWords, setMyWords] = useState<string[]>([]);
  const [opponentWords, setOpponentWords] = useState<string[]>([]);

  const [timeLeftMs, setTimeLeftMs] = useState<number>(0);
  const [endAt, setEndAt] = useState<number | null>(null);

  const [finalData, setFinalData] = useState<GameEndData | null>(null);

  const resetGameStatus = () => {
    setState("WAIT");
    setFinalData(null);
    setMyWords([]);
    setOpponentWords([]);
  };

  // 게임 방 입장 할때
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit("join-room");

    const onRoomUpdated = ({ players }: { players: PlayerSnapshot[] }) => {
      setRoomData((prev) => ({ ...prev, players }));
    };

    const onSetMyId = ({ you }: { you: string }) => {
      setRoomData((prev) => ({ ...prev, myId: you }));
    };

    socket.on("room-updated", onRoomUpdated);
    socket.on("set-my-id", onSetMyId);

    return () => {
      socket.off("room-updated", onRoomUpdated);
      socket.off("set-my-id", onSetMyId);
    };
  }, []);

  const me = roomData.players.find((p) => p.socketId === roomData.myId);
  const opponent = roomData.players.find(
    (p) => p.socketId !== roomData.myId && roomData.myId !== "",
  );

  const handleWordResult = (word: string, senderId: string) => {
    if (!word || !senderId || !roomData.myId) return;

    if (senderId === roomData.myId) {
      setMyWords((prev) => [...prev, word]);
    } else {
      setOpponentWords((prev) => [...prev, word]);
    }
  };

  ///게임 시작할때

  useEffect(() => {
    const onGameStart = ({ chosungPair, endAt }: any) => {
      setState("PLAY");
      setChosungPair(chosungPair);
      setEndAt(endAt);
      setMyWords([]);
      setOpponentWords([]);
    };

    const onWordValidated = (res: any) => {
      console.log("나의 ID:", roomData.myId);
      console.log("서버가 보낸 보낸이 ID:", res.senderId);

      setLastResult(res);
      if (!res.valid) return;

      // handleWordResult(res.word, res.senderId);

      if (res.senderId === socket.id) {
        setMyWords((prev) => [...prev, res.word]);
      } else {
        setOpponentWords((prev) => [...prev, res.word]);
      }
    };

    socket.on("game-start", onGameStart);
    socket.on("word-validated", onWordValidated);

    return () => {
      socket.off("game-start", onGameStart);
      socket.off("word-validated", onWordValidated);
    };
  }, []);

  // 타이머 시작
  useEffect(() => {
    if (!endAt || state !== "PLAY") return;

    const id = setInterval(() => {
      setTimeLeftMs(Math.max(0, endAt - Date.now()));
    }, 1000);

    return () => clearInterval(id);
  }, [endAt, state]);

  //타이머 종료+ 보조안전
  useEffect(() => {
    if (state === "PLAY" && endAt && Date.now() >= endAt) {
      setState("END");
    }
  }, [timeLeftMs, state, endAt]);

  useEffect(() => {
    const onGameEnd = (data: GameEndData) => {
      if (!data || !data.scores) return;

      const myData = data.scores.find((p) => p.socketId === roomData.myId);
      const opData = data.scores.find((p) => p.socketId !== roomData.myId);

      if (myData) myData.score;
      if (opData) opData.score;

      setFinalData(data);
      setState("END");
      setEndAt(null);
    };

    socket.on("game-end", onGameEnd);

    return () => {
      socket.off("game-end", onGameEnd);
    };
  }, []);

  return (
    <>
      <div className={styles["out-of-stage"]} />

      {state === "END" && finalData && (
        <ResultModal
          socket={socket}
          scores={finalData.scores}
          words={finalData.words}
          onReset={resetGameStatus}
        />
      )}

      <div className={styles.stage}>
        <CommonHeader
          style={{
            position: "absolute",
            fontFamily: "'Batang', '바탕', serif",
            fontSize: "14px",
            fontWeight: "bold",
            WebkitFontSmoothing: "none",
            letterSpacing: "-0.5px",
          }}
          title="자음 놀이 (놀이마당)"
        />
        <PlayerPanel
          key="left-me"
          nickname={me?.nickname ?? "대기중"}
          words={myWords}
        />
        <CenterPlay
          chosungPair={chosungPair}
          lastResult={lastResult}
          onSubmitWord={(word) => socket.emit("submit-word", { word })}
          timeLeftMs={timeLeftMs}
          state={state}
        />
        <PlayerPanel
          key="right-opponent"
          nickname={
            opponent && opponent.socketId !== roomData.myId
              ? opponent.nickname
              : roomData.players.length < 2
                ? "상대를 기다리는중..."
                : "로딩 중"
          }
          words={opponentWords}
        />
      </div>
    </>
  );
};

export default GameRoom;

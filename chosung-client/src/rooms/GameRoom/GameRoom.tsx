  import { useState, useEffect } from "react";
  import { socket } from "@/socket/socket";
  import PlayerPanel from "./components/PlayerPanel/PlayerPanel";
  import CenterPlay from "./components/CenterPlay/CenterPlay";
  import ResultModal from "./components/ResultModal";
  import type { RoomStatus,PlayerSnapshot } from "@/types/domain/room";

  const GameRoom = () => {
  const [roomData,setRoomData]=useState<{
    players:PlayerSnapshot[];
    myId:string;
  }>({
    players:[],
    myId:""
  })

  const [state, setState] = useState<RoomStatus>("WAIT");

  const [chosungPair, setChosungPair] = useState<[string, string]>(["?", "?"]);
  const [lastResult, setLastResult] = useState<any>(null);

  const [myWords, setMyWords] = useState<string[]>([]);
  const [opponentWords, setOpponentWords] = useState<string[]>([]);

  const [timeLeftMs, setTimeLeftMs] = useState<number>(0);
  const [endAt, setEndAt] = useState<number | null>(null);

    // 게임 방 입장 할때
  useEffect(() => {
  const onRoomUpdated=({ players }: { players: PlayerSnapshot[]}) => {

    setRoomData((prev) => ({ ...prev, players }));
    };

const onSetMyId=({you}:{you:string})=>{
setRoomData((prev)=>({...prev , myId:you}));
};


socket.on("room-updated",onRoomUpdated);
socket.on("set-my-id",onSetMyId);

    return () => {
      socket.off("room-updated",onRoomUpdated);
      socket.off("set-my-id",onSetMyId);
    };
  }, []);

  const me = roomData.players.find(p => p.socketId === roomData.myId);
  const opponent = roomData.players.find(p => p.socketId !== roomData.myId && roomData.myId!=="");


  const handleWordResult = (word: string, senderId: string) => {

      if (!word || !senderId||!roomData.myId) return;

      if (senderId === roomData.myId) {
        setMyWords((prev) =>  [...prev, word] );

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
        setLastResult(res);
        if (!res.valid) return;
        handleWordResult(res.word, res.senderId);
      };

      socket.on("game-start", onGameStart);
      socket.on("word-validated", onWordValidated);

      return () => {
        
        socket.off("game-start", onGameStart);
        socket.off("word-validated", onWordValidated);
      };
    }, [roomData.myId]);

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
      const onGameEnd = () => {
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

        {state === "END" && <ResultModal />}

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
        <PlayerPanel key="left-me" nickname={me?.nickname??"대기중"} words={myWords} />
          <CenterPlay
            chosungPair={chosungPair}
            lastResult={lastResult}
            onSubmitWord={(word) => socket.emit("submit-word", { word })}
            timeLeftMs={timeLeftMs}
          />
          <PlayerPanel key="right-opponent" nickname={opponent && opponent.socketId !== roomData.myId ? opponent.nickname :(roomData.players.length < 2 ?"상대 대기중...":"로딩 중")} words={opponentWords} />
        </div>
      </>
    );
  };

  export default GameRoom;

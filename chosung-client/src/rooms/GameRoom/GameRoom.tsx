  import { useState, useEffect } from "react";
  import { socket } from "@/socket/socket";
  import PlayerPanel from "./components/PlayerPanel/PlayerPanel";
  import CenterPlay from "./components/CenterPlay/CenterPlay";
  import ResultModal from "./components/ResultModal";
  import type { RoomStatus,PlayerSnapshot,GameEndData } from "@/types/domain/room";

  const GameRoom = () => {
  const [roomData,setRoomData]=useState<{
    players:PlayerSnapshot[];
    myId:string;
    myScore:number
  }>({
    players:[],  //둘을 같이 받기때문
    myId:"",
    myScore:0,
  })

  const [state, setState] = useState<RoomStatus>("WAIT");

  const [chosungPair, setChosungPair] = useState<[string, string]>(["?", "?"]);
  const [lastResult, setLastResult] = useState<any>(null);

  const [myWords, setMyWords] = useState<string[]>([]);
  const [opponentWords, setOpponentWords] = useState<string[]>([]);

  const [timeLeftMs, setTimeLeftMs] = useState<number>(0);
  const [endAt, setEndAt] = useState<number | null>(null);

  const [finalData,setFinalData]= useState<GameEndData | null > (null);


    // 게임 방 입장 할때
  useEffect(() => {

if(!socket.connected){
  socket.connect();
}
socket.emit("join-room");

  const onRoomUpdated=({ players }: { players: PlayerSnapshot[]}) => {

    setRoomData((prev) => ({ ...prev, players }));
    };

const onSetMyId=({you}:{you:string})=>{
setRoomData((prev)=>({...prev , myId : you }));
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

      if ( !word || !senderId ||!roomData.myId ) return;

      if (senderId === roomData.myId) {
        setMyWords((prev) =>  [...prev, word] );
      } else {
        setOpponentWords((prev) => [...prev, word]);
      }
  };


    ///게임 시작할때

    useEffect(() => {

      const onGameStart = ({ chosungPair, endAt}: any) => {
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
    }, [endAt, state,]);

    //타이머 종료+ 보조안전
    useEffect(() => {
      if (state === "PLAY" && endAt && Date.now() >= endAt) {
        setState("END");
      }
    }, [timeLeftMs, state, endAt]);

    useEffect(() => {
      const onGameEnd = (data:GameEndData) => {
     console.log("게임종료 데이터 수신:",data);
     
    
        const myData= data.scores.find(p=>p.socketId === roomData.myId);
        const opData = data.scores.find(p=>p.socketId !== roomData.myId);

        if(myData) myData.score;
        if(opData) opData.score;
        
        setFinalData(data);
        setState("END");
        setEndAt(null);
      };

      socket.on("game-end", onGameEnd);

      return () => { socket.off("game-end", onGameEnd)};
    }, [roomData.myId]);
console.log("렌더링 체크", "상태:",state,"데이터 존재 여부:",!!finalData);



<div>
  <p>현재 상태: {state}</p>
  <p>내 닉네임: {me?.nickname}</p>
  <p>플레이어 리스트 수: {roomData.players.length}</p>
</div>

    return (
      <>
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:"#1B2E57",
            zIndex: "1",
          }}
        />
    
 <div style={{position:"absolute", top:0, width:"100%", height:"75px", background:"#fff", opacity:"0.5", fontSize:"20px", zIndex:9999}}>레디 버튼은 두명이 입장했을때 활성화 됩니다.한명이 레디버튼을 누르면 다른 사람이 누르지않아도 10초 뒤 바로 시작됩니다. 두명이 레디를 누르면 바로 게임이 시작합니다.</div>
     
        {/* {state === "END"&&finalData && <ResultModal scores={finalData.scores} />} */}

        <div
          className="stage"
          style={{
            width: "1200px",
            height: "700px",
            display: "flex",
            position: "absolute",
            top: "55%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            justifyContent: "space-between",
            background: "#fff",
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
            state={state}
          />
          <PlayerPanel key="right-opponent" nickname={opponent && opponent.socketId !== roomData.myId ? opponent.nickname :(roomData.players.length < 2 ?"상대를 기다리는중...":"로딩 중")} words={opponentWords} />
        </div>
      </>
    );
  };

  export default GameRoom;

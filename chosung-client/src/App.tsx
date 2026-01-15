import { useState, useEffect, useRef } from "react";
import { socket } from "@/socket/socket";
import GameRoom from "./rooms/GameRoom/GameRoom";

type RoomStatus = "WAIT" | "READY";

const App = () => {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState<RoomStatus>("WAIT");
  const [entered, setEntered] = useState(false);
  const connectedRef = useRef(false);

  const handleJoin = () => {
    console.log("🔥 join-room emit 시도");
    console.log("socket.connected:", socket.connected);

    if (!socket.connected) {
      console.log("❌ 아직 socket 연결 안됨");
      return;
    }

    socket.emit("join-room", {
      nickname: "아무개",
    });
  };

  useEffect(() => {
    if (!connectedRef.current) {
      socket.connect();
      connectedRef.current = true;
    }

    socket.on("connect", () => {
      console.log("socket connected:", socket.id);
      setConnected(true);
    });
    socket.on("disconnect", () => {
      setConnected(false);
      setStatus("WAIT");
    });

    socket.on("room-wait", () => {
      setStatus("WAIT");
    });

    return () => {
      connectedRef.current = false;
      socket.off("connect");
      socket.off("disconnect");
      socket.off("room-ready");
      socket.off("room-wait");
    };
  }, []);

  return (
    <div className="background-image">
      <h1>초성놀이</h1>

      {!entered && (
        <>
          <button
            className="enterRoom"
            onClick={() => {
              handleJoin();
              setEntered(true);
            }}
          >
            방 입장하기
          </button>
        </>
      )}
      {entered && <GameRoom />}
    </div>
  );
};

export default App;

import { useState, useEffect } from "react";
import { socket } from "./socket/socket";
import GameRoom from "./rooms/GameRoom/GameRoom";

type RoomStatus = "WAIT" | "READY";

const App = () => {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState<RoomStatus>("WAIT");
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      setConnected(true);
      console.log("connected:", socket.id);
    });

    socket.on("disconnect", () => {
      setConnected(false);
      setStatus("WAIT");
    });

    socket.on("room-ready", () => {
      setStatus("READY");
    });

    socket.on("room-wait", () => {
      setStatus("WAIT");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("room-ready");
      socket.off("room-wait");
      socket.disconnect();
    };
  }, []);

  return (
    <div className="background-image">
      <h1>초성놀이</h1>
      {/* 
      {!entered && (
        <>
          <button className="door-knock" onClick={() => setEntered(true)}>
            방 두드리기
          </button>
        </>
      )}
      {entered && <GameRoom />} */}
      <GameRoom />
    </div>
  );
};

export default App;

import { useState, useEffect } from "react";
import { socket } from "./socket/socket";

type RoomStatus = "WAIT" | "READY";

const App = () => {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState<RoomStatus>("WAIT");

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
      <button className="door-knock">방 두드리기</button>
    </div>
  );
};

export default App;

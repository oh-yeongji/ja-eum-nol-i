import { useState, useEffect } from "react";
import { socket } from "./socket";

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
      console.log("room-ready received");
      setStatus("READY");
    });

    socket.on("room-wait", () => {
      console.log("room-wait received");
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

  const joinRoom = () => {
    socket.connect();
    socket.emit("join-room", {
      userId: crypto.randomUUID(),
      nickname: "test-user",
    });
  };

  return (
    <div>
      <h1>sokcet test</h1>

      <button onClick={joinRoom} style={{ color: "blue" }}>
        방입장하기
      </button>

      <p>connected:{connected ? "yes" : "no"}</p>
      <p>room status: {status}</p>
    </div>
  );
};

export default App;

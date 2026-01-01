import { useState, useEffect } from "react";
import { socket } from "./socket";

type RoomStatus = "WAIT" | "READY";
type Step = "ENTER" | "NICKNAME" | "WAIT";

const App = () => {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState<RoomStatus>("WAIT");
  const [step, setStep] = useState<Step>("ENTER");
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      setConnected(true);
      console.log("connected:", socket.id);
    });

    socket.on("disconnect", () => {
      setConnected(false);
      setStatus("WAIT");
      setStep("ENTER");
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

  const handleEnter = () => {
    setStep("NICKNAME");
  };

  const handleJoinRoom = () => {
    if (!nickname.trim()) return;
    socket.connect();
    socket.emit("join-room", {
      userId: crypto.randomUUID(),
      nickname,
    });

    setStep("WAIT");
  };

  return (
    <div className="background-image">
      {step === "ENTER" && (
        <button className="door-knock" onClick={handleEnter}>
          방 두드리기
        </button>
      )}

      {step === "NICKNAME" && (
        <div>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임 입력"
          />
          <button onClick={handleJoinRoom}>입장하기</button>
        </div>
      )}

      {step === "WAIT" && (
        <div>
          <p>들어갈방을 찾고있소....</p>
          <p>room status: {status}</p>
        </div>
      )}
    </div>
  );
};

export default App;

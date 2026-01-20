import { useState, useEffect, useRef } from "react";
import { socket } from "@/socket/socket";
import GameRoom from "./rooms/GameRoom/GameRoom";
import GuideModal from "./rooms/GameRoom/components/GuideModal";

type RoomStatus = "WAIT" | "READY";

const App = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState<RoomStatus>("WAIT");
  const [entered, setEntered] = useState(false);
  const connectedRef = useRef(false);

  const handleEnterClick = () => {
    const skip = localStorage.getItem("skipGuide") === "true";
    if (skip) {
      enterGameRoom(true);
    } else {
      setShowGuide(true);
    }
  };

  const enterGameRoom = (skipChecked?: boolean) => {
    if (skipChecked) localStorage.setItem("skipGuide", "true");

    if (!entered) {
      setEntered(true);
      setShowGuide(false);
    }
  };

  const handleJoin = () => {
    console.log("join-room emit 시도");
    console.log("socket.connected:", socket.connected);

    if (!socket.connected) {
      console.log("아직 socket 연결 안됨");
      return;
    }

    socket.emit("join-room", {
      nickname: "아무개",
    });
  };

  useEffect(() => {
    if (connectedRef.current) return;

    socket.connect();
    connectedRef.current = true;

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("room-wait", () => {
      setStatus("WAIT");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("room-wait");
    };
  }, []);

  return (
    <div className="background-image">
      <h1>초성놀이</h1>

      {!entered && !showGuide && (
        <>
          <button className="enterRoom" onClick={handleEnterClick}>
            방 입장하기
          </button>

          {/*강제로 모달 띄우기 */}
          <button
            onClick={() => {
              localStorage.removeItem("skipGuide");
              setShowGuide(true);
            }}
          >
            게임 설명 다시 보기 (Dev)
          </button>
        </>
      )}

      {showGuide && (
        <GuideModal
          onConfirm={(skipChecked: boolean) => enterGameRoom(skipChecked)}
        />
      )}

      {entered && <GameRoom />}
    </div>
  );
};

export default App;

import { useState, useEffect, useRef } from "react";
import { socket } from "@/socket/socket";
import GameRoom from "./rooms/GameRoom/GameRoom";
import GuideModal from "./rooms/GameRoom/components/GuideModal";
import type { RoomStatus } from "types/domain/room";
import "./index.css";
import WaitingRoom from "./rooms/GameRoom/components/WaitingRoom/WaitingRoom";
import CommonHeader from "./rooms/GameRoom/components/CommonHeader/CommonHeader";

const App = () => {
  const [connected, setConnected] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [status, setStatus] = useState<RoomStatus>("WAIT");
  const [showGuide, setShowGuide] = useState(false);
  const [skip, setSkip] = useState(() => {
    return localStorage.getItem("skipGuide") === "true";
  });
  const [entered, setEntered] = useState(false);
  const hasJoinedRef = useRef(false);

  const handleConfirm = (skipChecked: boolean) => {
    setSkip(skipChecked);
    if (skipChecked) {
      localStorage.setItem("skipGuide", "true");
    }
    enterGameRoom();
  };

  const handleClose = () => {
    setShowGuide(false);
  };
  useEffect(() => {
    const currentClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      );
    };
    currentClock();
    const timer = setInterval(currentClock, 1000);
    return () => clearInterval(timer);
  }, []);

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

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("room-wait", () => setStatus("WAIT"));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("room-wait");
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !entered && !showGuide) {
        handleEnterClick();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [entered, showGuide]);

  useEffect(() => {
    if (!connected || !entered) return;
    if (hasJoinedRef.current) return;
    socket.emit("join-room");
    hasJoinedRef.current = true;
  }, [connected, entered]);

  return (
    <div className="desktop-screen">
      {!entered && (
        <div className="main-window">
          <CommonHeader title="설치 프로그램: 자음놀이 (v1.0.2)" />

          <div className="window-content">
            <h2 className="title1">세기말</h2>
            <div className="app-identity">
              <h1 className="title2">자음 놀이</h1>
              <span className="versionName">v 1.0.2</span>
            </div>
            <div>
              {!showGuide && (
                <button className="enterRoom" onClick={handleEnterClick}>
                  방 입장하기
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {!entered && (
        <div className="taskbar">
          <button className="systemStartBtn">시작</button>

          <div className="system-tray">{currentTime}</div>
        </div>
      )}

      {showGuide && (
        <GuideModal
          initialSkip={skip}
          onToggle={setSkip}
          onConfirm={handleConfirm}
          onClose={handleClose}
        />
      )}

      {entered && (
        <div className="game-room-wrapper">
          <WaitingRoom />
        </div>
      )}
    </div>
  );
};

export default App;

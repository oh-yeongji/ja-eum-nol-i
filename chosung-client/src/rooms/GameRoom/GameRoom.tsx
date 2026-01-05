import { useEffect } from "react";
import { socket } from "../../socket/socket";
import GameWrapper from "./components/GameWrapper";

const GameRoom = () => {
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

      <div
        className="stage"
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: "9",
        }}
      >
        <GameWrapper />
      </div>
    </>
  );
};

export default GameRoom;

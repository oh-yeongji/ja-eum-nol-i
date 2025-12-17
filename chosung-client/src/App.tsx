import { useEffect } from "react";
import { socket } from "./socket";

function App() {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("socket connected:", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>소켓 연결 테스트 중</div>;
}

export default App;

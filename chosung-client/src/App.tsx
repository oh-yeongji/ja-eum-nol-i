import { useEffect } from "react";
import { socket } from "./socket";

const App = () => {
  useEffect(() => {
    const onConnect = () => {
      console.log("socket connected:", socket.id);
    };

    socket.on("connect", onConnect);

    return () => {
      socket.off("connect", onConnect);
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <button> 방입장하기</button>
    </div>
  );
};

export default App;

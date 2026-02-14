import { useEffect, useState, useRef } from "react";
import { socket } from "@/socket/socket";
import styles from "./WaitingRoom.module.css";
import CommonHeader from "../CommonHeader/CommonHeader";
import GameRoom from "../../GameRoom";
import type { RoomStatus, PlayerSnapshot } from "@/types/domain/room";
import { log } from "console";

const WaitingRoom = () => {
  const [state, setState] = useState<RoomStatus>("WAIT");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [users, setUsers] = useState<PlayerSnapshot[]>([]);
  const [myId, setMyId] = useState<string>("");
  const [chatList, setChatList] = useState<
    { nickname: string; message: string }[]
  >([]);
  const chatInputRef = useRef<HTMLInputElement>(null);

  const [startCountdown, setStartCountdown] = useState<number | null>(null);
  const times = [30, 60, 90, 120];
  const [timeIdx, setTimeIdx] = useState(1);

  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [gameInitData, setGameInitData] = useState<any>(null);

  // const [isCancel, setIsCancel] = useState<boolean>(false);

  const me = users?.find((u) => u.socketId === myId);

  const handleSendMessage = () => {
    const message = chatInputRef.current?.value;
    if (!message || message.trim() === "") return;

    socket.emit("send-chat", {
      socketId: myId,
      nickname: me?.nickname,
      message,
    });

    if (chatInputRef.current) {
      chatInputRef.current.value = "";
    }
  };

  console.log("WaitingRoom Render - myId:", myId, "me found:", !!me);

  const isOwner = me?.isOwner || false;

  useEffect(() => {
    socket.on("set-my-id", ({ you }) => {
      setMyId(you);
    });

    socket.on("receive-chat", (chatData) => {
      setChatList((prev) => [...prev, chatData]);
    });

    socket.on(
      "room-updated",
      ({
        players,
        status,
      }: {
        players: PlayerSnapshot[];
        status: RoomStatus;
      }) => {
        setUsers(players);
        if (status) setState(status);
      },
    );

    socket.on("countdown-start", ({ seconds }) => {
      setState("COUNTDOWN");
      if (intervalRef.current) clearInterval(intervalRef.current);
      setStartCountdown(seconds);

      intervalRef.current = setInterval(() => {
        setStartCountdown((prev) => {
          if (prev === null || prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    });

    socket.on("room-wait", () => {
      setState("WAIT");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setStartCountdown(null);
    });

    return () => {
      socket.off("set-my-id");
      socket.off("receive-chat");
      socket.off("room-updated");
      socket.off("countdown-start");
      socket.off("room-wait");
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    socket.on("game-start", (gameData) => {
      console.log("게임 시작 데이터 수신:", gameData);
      if (intervalRef.current) clearInterval(intervalRef.current);
      setGameInitData({
        ...gameData,
        players: users,
        myId: myId,
      });
      setIsGameStarted(true);
    });
    return () => {
      socket.off("game-start");
    };
  }, [users]);

  useEffect(() => {
    if (isOwner) {
      socket.emit("change-setting", { timeLimit: times[timeIdx] });
    }
  }, [timeIdx, isOwner]);

  if (isGameStarted && gameInitData) {
    return <GameRoom timeLimit={times[timeIdx]} initialData={gameInitData} />;
  }

  return (
    <div className={styles["out-of-stage"]}>
      {startCountdown !== null && (
        <div className={styles.countdownOverlay}>
          <div className={styles.countdownContent}>
            <div key={startCountdown} className={styles.countdownNumber}>
              {startCountdown}
            </div>

            {isOwner && (
              <button
                className={styles.overlayCancelBtn}
                onClick={() => socket.emit("toggle-ready")}
              >
                취소 (ESC)
              </button>
            )}
          </div>
        </div>
      )}
      <div className={styles.wrapper}>
        <CommonHeader
          style={{
            position: "absolute",
          }}
          title="자음놀이 (대기방)"
        />
        <div className={styles.stage}>
          <div className={styles.LobbySidePanel}>
            <div className={styles.settingWrapper}>
              <p className={styles.panelTitle}>시간 설정</p>
              <div className={styles.settingContainer}>
                <div
                  className={styles.leftBtn}
                  onClick={() => {
                    setTimeIdx((prev) =>
                      prev === 0 ? times.length - 1 : prev - 1,
                    );
                  }}
                >
                  ◀
                </div>

                <div className={styles.timeSetting}>{times[timeIdx]}초</div>
                <div
                  className={styles.rightBtn}
                  onClick={() => {
                    setTimeIdx((prev) =>
                      prev === times.length - 1 ? 0 : prev + 1,
                    );
                  }}
                >
                  ▶
                </div>
              </div>
            </div>

            <div className={styles.userListWrapper}>
              <p className={styles.panelTitle}>입장 유저목록</p>
              <div className={styles.userList}>
                {users.map((user) => (
                  <div key={user.socketId} className={styles.userContainer}>
                    <div className={styles.nickname}>
                      {user.isOwner ? "[방장]" : ""} {user.nickname}
                    </div>
                    {user.isReady && (
                      <div className={styles.readyMark}>Ready</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`${styles.playerStatusBtn}
              ${me?.isReady ? styles.active : ""}
             ${users.length < 2 ? styles.disabled : ""}
            `}
              onClick={() => {
                if (users.length < 2) {
                  alert("최소 게임시작인원이 부족합니다.");
                  return;
                }
                socket.emit("toggle-ready");
              }}
            >
              {isOwner
                ? me?.isReady
                  ? "GAME START"
                  : "READY?"
                : me?.isReady
                  ? "READY!"
                  : "READY?"}
            </div>
          </div>
          <div className={styles.chatScreen}>
            <div className={styles.chatLog}>
              [시스템] player1님이 대기실에 입장했습니다.
            </div>

            {chatList.map((chat, idx) => (
              <div key={idx} className={styles.chatContainer}>
                <div className={styles.nickname}>{chat.nickname}</div>
                <div className={styles.semicolon}>:</div>
                <div className={styles.chat}>{chat.message}</div>
              </div>
            ))}

            <div className={styles.inputContainer}>
              <input
                className={styles.msgChat}
                type="text"
                ref={chatInputRef}
                onKeyDown={(e) => {
                  if (e.nativeEvent.isComposing) return;
                  if (e.key === "Enter") handleSendMessage();
                }}
              />
              <button className={styles.msgSendBtn} onClick={handleSendMessage}>
                Enter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;

import { useEffect, useState, useRef } from "react";
import { socket } from "@/socket/socket";
import styles from "./WaitingRoom.module.css";
import CommonHeader from "../CommonHeader/CommonHeader";
import GameRoom from "../../GameRoom";
import type { RoomStatus, PlayerSnapshot } from "@/types/domain/room";

const WaitingRoom = () => {
  const [showReadyPopup, setShowReadyPopup] = useState(false);
  const [users, setUsers] = useState<PlayerSnapshot[]>([]);
  const [myId, setMyId] = useState<string>("");
  const [showForceStart, setShowForceStart] = useState<boolean>(false);
  const [state, setState] = useState<RoomStatus>("WAIT");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [chatList, setChatList] = useState<
    { socketId: string; type: string; nickname: string; message: string }[]
  >([]);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const [startCountdown, setStartCountdown] = useState<number | null>(null);
  const MAX_TIME_CHANGE_COUNT = 3;
  const [usedTimeChangeCount, setUsedTimeChangeCount] = useState<number>(0);

  const times = [30, 60, 90, 120];
  const [timeIdx, setTimeIdx] = useState(1);
  const [appliedTime, setAppliedTime] = useState<number>(60);

  const [startTrigger, setStartTrigger] = useState("");
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [gameInitData, setGameInitData] = useState<any>(null);

  const me = users?.find((u) => u.socketId === myId);

  const isOwner = me?.isOwner || false;
  const myReadyStatus = me?.isReady || false;

  // const [isCancel, setIsCancel] = useState<boolean>(false);

  const handleSendMessage = () => {
    const message = chatInputRef.current?.value;
    if (!me || !me?.nickname || !message || message.trim() === "") {
      console.warn("닉네임 정보가 없거나 메시지가 비어있습니다.");
      return;
    }

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

  useEffect(() => {
    socket.on("set-my-id", ({ you }) => {
      setMyId(you);
    });

    socket.on("settings-updated", ({ timeLimit, usedTimeChangeCount }) => {
      console.log("settings-updated 받음:", timeLimit, usedTimeChangeCount);

      setAppliedTime(timeLimit);
      setUsedTimeChangeCount(usedTimeChangeCount);

      const idx = times.findIndex((t) => t === timeLimit);

      if (idx !== -1) setTimeIdx(idx);
    });

    socket.on("receive-chat", (chatData) => {
      setChatList((prev) => [...prev, chatData]);
    });

    socket.on("load-history", (history) => {
      setChatList(history);
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
            clearInterval(intervalRef.current!);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    });

    socket.on("room-wait", () => {
      console.log("서버로부터 중단 신호 받음");
      setState("WAIT");
      setShowReadyPopup(false);
      setStartCountdown(null);
      setStartTrigger("");

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    });

    return () => {
      socket.off("set-my-id");
      socket.off("settings-updated");
      socket.off("receive-chat");
      socket.off("load-history");
      socket.off("room-updated");
      socket.off("countdown-start");
      socket.off("room-wait");
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isOwner) {
      setShowForceStart(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowForceStart(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isOwner]);

  useEffect(() => {
    if (!showReadyPopup && startCountdown === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isOwner && startTrigger === "FORCE") {
          socket.emit("cancel-force-start");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startCountdown, startTrigger, isOwner, showReadyPopup]);

  useEffect(() => {
    socket.on("all-ready-notice", ({ trigger }) => {
      setStartTrigger(trigger);
      setShowReadyPopup(true);
    });

    socket.on("countdown-start", ({ seconds }) => {
      setShowReadyPopup(false);
      setState("COUNTDOWN");
      setStartCountdown(seconds);

      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setStartCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(intervalRef.current!);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    });

    socket.on("game-start", (game) => {
      setGameInitData({
        ...game,
        players: users,
        myId: myId,
      });
      setIsGameStarted(true);
    });

    socket.on("room-wait", () => {
      setShowReadyPopup(false);
      setStartCountdown(null);
      setState("WAIT");
    });

    return () => {
      socket.off("all-ready-notice");
      socket.off("countdown-start");
      socket.off("game-start");
      socket.off("room-wait");
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [users, myId]);

  if (isGameStarted && gameInitData) {
    return <GameRoom timeLimit={times[timeIdx]} initialData={gameInitData} />;
  }

  return (
    <div className={styles["out-of-stage"]}>
      {showReadyPopup && (
        <div className={styles.readyOverlay}>
          <div className={styles.readyWrapper}>
            <CommonHeader
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: "none",
                margin: 0,
              }}
              title="준비..."
            />
            {startTrigger === "ALL_READY" ? (
              <div className={styles.readyTextContainer}>
                <p className={styles.readyText}>
                  모든 사용자가 준비되었습니다.
                  <br />
                  3초 타이머 후 게임이 시작됩니다.
                </p>
              </div>
            ) : (
              <div className={styles.readyTextContainer}>
                <p className={styles.readyText}>
                  방장의 권한으로
                  <br />
                  3초 타이머 후 게임이 시작됩니다.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {startCountdown !== null && (
        <div className={styles.countdownOverlay}>
          <div className={styles.countdownWrapper}>
            <CommonHeader
              style={{
                position: "relative",
                top: 0,
                left: 0,
                width: "100%",
                transform: "none",
                margin: 0,
              }}
              title="데이터 동기화중..."
            />

            <div className={styles.windowContent}>
              <p className={styles.infoText}>게임 시작까지...</p>
              <div
                key={`container-${startCountdown}`}
                className={`${styles.countdownNumberContainer} ${styles.flashActive}`}
              >
                <div key={startCountdown} className={styles.countdownNumber}>
                  {startCountdown}
                </div>
              </div>

              <div className={styles.btnGroup}>
                <button
                  disabled={!isOwner || startTrigger === "ALL_READY"}
                  className={`${styles.closeBtn} ${!isOwner || startTrigger === "ALL_READY" ? styles.disabled : ""}`}
                  onClick={() => {
                    if (isOwner && startTrigger === "FORCE") {
                      socket.emit("cancel-force-start");
                    }
                  }}
                >
                  취소 (Esc)
                </button>
              </div>
            </div>
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
              <div className={styles.panelTitleContainer}>
                <p className={styles.panelTitle}>시간 설정</p>
                <p className={styles.panelTitle}>
                  시간 변경 가능 횟수 :
                  {MAX_TIME_CHANGE_COUNT - usedTimeChangeCount}회
                </p>
              </div>

              <div className={styles.settingContainer}>
                <div className={styles.first}>
                  <button
                    disabled={
                      !isOwner || usedTimeChangeCount >= MAX_TIME_CHANGE_COUNT
                    }
                    className={`${styles.leftBtn} ${!isOwner ? styles.disabled : ""}`}
                    onClick={() => {
                      setTimeIdx((prev) =>
                        prev === 0 ? times.length - 1 : prev - 1,
                      );
                    }}
                  >
                    ◀
                  </button>

                  <div
                    className={`${styles.timeSetting} ${times[timeIdx] === appliedTime ? styles.selectedTime : ""}`}
                  >
                    {times[timeIdx]}초
                  </div>
                  <button
                    disabled={
                      !isOwner || usedTimeChangeCount >= MAX_TIME_CHANGE_COUNT
                    }
                    className={`${styles.rightBtn} ${!isOwner ? styles.disabled : ""}`}
                    onClick={() => {
                      setTimeIdx((prev) =>
                        prev === times.length - 1 ? 0 : prev + 1,
                      );
                    }}
                  >
                    ▶
                  </button>
                </div>

                <button
                  disabled={
                    !isOwner ||
                    times[timeIdx] === appliedTime ||
                    usedTimeChangeCount >= MAX_TIME_CHANGE_COUNT
                  }
                  className={styles.changeBtn}
                  onClick={() => {
                    if (!isOwner) return;
                    if (usedTimeChangeCount >= MAX_TIME_CHANGE_COUNT) return;

                    socket.emit("change-setting", {
                      timeLimit: times[timeIdx],
                    });
                  }}
                >
                  {isOwner ? "변경" : "🔒 방장전용"}
                </button>
              </div>
            </div>

            <div className={styles.userListWrapper}>
              <p className={styles.panelTitle}>입장 유저목록</p>
              <div className={styles.userList}>
                {users.map((user) => (
                  <div key={user.socketId} className={styles.userContainer}>
                    <div
                      className={styles.nickname}
                      style={{
                        color: user.socketId === myId ? "#2f6df6" : "#000",
                      }}
                    >
                      {user.isOwner ? "[방장]" : ""} {user.nickname}
                      {user.socketId == myId ? " (당신)" : ""}
                    </div>
                    {user.isReady && (
                      <div className={styles.readyMark}>Ready</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button
              disabled={!isOwner || !showForceStart}
              className={styles.forceStart}
              onClick={() => {
                setStartTrigger("FORCE");
                socket.emit("force-start-game");
              }}
            >
              강제 시작
            </button>

            <div
              className={`${styles.playerStatusBtn}
              ${myReadyStatus ? styles.active : ""}
              ${users.length < 2 ? styles.disabled : ""}
           
            `}
              onClick={() => {
                if (users.length < 2) return;
                socket.emit("toggle-ready");
              }}
            >
              {isOwner
                ? myReadyStatus
                  ? "GAME START"
                  : "READY?"
                : myReadyStatus
                  ? "READY!"
                  : "READY?"}
            </div>
          </div>
          <div className={styles.chatScreen}>
            {chatList.map((chat, idx) => {
              const isSystem =
                chat.socketId === "system" || chat.type === "system";

              const isMe = !isSystem && chat.nickname === me?.nickname;
              return (
                <div key={idx} className={styles.chatContainer}>
                  {isSystem ? (
                    <div className={styles.systemMsg}>
                      <span className={styles.systemTag}>[시스템]</span>
                      <span className={styles.systemChat}>{chat.message}</span>
                    </div>
                  ) : (
                    <div
                      className={`${styles.userMsg} ${isMe ? styles.myChat : ""}`}
                    >
                      <span className={styles.nickname}>{chat.nickname}</span>
                      <span className={styles.semicolon}>:</span>
                      <span className={styles.userChat}>{chat.message}</span>
                    </div>
                  )}
                </div>
              );
            })}

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

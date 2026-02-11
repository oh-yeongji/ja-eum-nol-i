import { useEffect, useState, useRef } from "react";
import { socket } from "@/socket/socket";
import styles from "./WaitingRoom.module.css";
import CommonHeader from "../CommonHeader/CommonHeader";
import GameRoom from "../../GameRoom";
import type { RoomStatus, PlayerSnapshot } from "@/types/domain/room";

const WaitingRoom = () => {
  const [state, setState] = useState<RoomStatus>("WAIT");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [users, setUsers] = useState<PlayerSnapshot[]>([]);
  const [startCountdown, setStartCountdown] = useState<number | null>(null);
  const times = [30, 60, 90, 120];
  const [timeIdx, setTimeIdx] = useState(1);

  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isCancel, setIsCancel] = useState<boolean>(false);

  const myId = socket.id;

  const me = users?.find((u) => u.socketId === myId);
  console.log("me:", me);

  const other = users?.find((u) => u.socketId !== myId);

  const isOwner = me?.isOwner || false;

  useEffect(() => {
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

    socket.on("game-start", (gameData) => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsGameStarted(true);
    });

    return () => {
      socket.off("room-updated");
      socket.off("countdown-start");
      socket.off("room-wait");
      socket.off("game-start");
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (isGameStarted) {
    return <GameRoom timeLimit={times[timeIdx]} />;
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
        <CommonHeader title="초성게임" />
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
            <div className={styles.chat}>player1: 안녕하세요~</div>
            <div className={styles.inputContainer}>
              <input className={styles.msgChat} type="text" />
              <button className={styles.msgSendBtn}>Enter</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;

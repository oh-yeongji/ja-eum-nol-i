import { useState } from "react";
import styles from "./WaitingRoom.module.css";
import CommonHeader from "../CommonHeader/CommonHeader";
import GameRoom from "../../GameRoom";

const WaitingRoom = () => {
  const times = [30, 60, 90, 120];
  const [timeIdx, setTimeIdx] = useState(1);
  const [isReady, setIsReady] = useState<boolean>(false);
  const users = [
    { id: 1, name: "player1", ready: isReady },
    { id: 2, name: "player2", ready: false },
  ];

  const [isGameStart, setIsGameStart] = useState<boolean>(false);
  if (isGameStart) {
    return <GameRoom timeLimit={times[timeIdx]} />;
  }

  return (
    <div className={styles["out-of-stage"]}>
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
                  <div key={user.id} className={styles.userContainer}>
                    <div className={styles.userName}>{user.name}</div>
                    {user.ready && (
                      <div className={styles.readyMark}>ready</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`${styles.playerStatusBtn} ${isReady ? styles.active : ""}`}
              onClick={() => {
                setIsReady(!isReady);
                setTimeout(() => setIsGameStart(true), 500);
              }}
            >
              {isReady ? "READY!" : "READY"}
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

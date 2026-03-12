import { Socket } from "socket.io-client";
import { GameEndData } from "@/types/domain/room";

interface UsedWord {
  word: string;
  senderId: string;
  definitions: string[];
}

interface ResultModalProps {
  socket: Socket | null;
  scores: GameEndData["scores"];
  words: UsedWord[];
  onReset: () => void;
}

const ResultModal = ({
  socket,
  scores,
  words = [],
  onReset,
}: ResultModalProps) => {
  const myId = socket?.id;
  const me = scores.find((s) => s.socketId === myId) || scores[0];
  const opponent = scores.find((s) => s.socketId !== myId) || scores[1];

  const isDraw =
    me &&
    opponent &&
    !me.isLeaver &&
    !opponent.isLeaver &&
    me.score === opponent.score;

  const getCardStyle = (p: typeof me, other: typeof opponent) => {
    if (isDraw) return { width: "45%", height: "200px" };

    if (other.isLeaver) return { width: "60%", height: "240px" };
    if (p.isLeaver) return { width: "30%", height: "180px" };

    if (p.score > other.score) {
      return { width: "50%", height: "220px" };
    } else {
      return { width: "40%", height: "180px" };
    }
  };

  const myWords = words.filter((w) => w.senderId === me?.socketId);
  const opWords = opponent
    ? words.filter((w) => w.senderId === opponent.socketId)
    : [];

  const handleRetry = () => {
    if (!socket) return;
    socket.emit("join-room");
    onReset();
  };

  const handleExit = () => {
    socket?.disconnect();
    window.location.href = "/";
  };

  return (
    <div
      style={{
        position: "fixed",
        width: "1300px",
        minHeight: "700px",
        height: "85vh",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxHeight: "85vh",
        background: "#C0C0C0",
        borderRadius: "0",
        borderTop: "3px solid #ffffff",
        borderLeft: "3px solid #ffffff",
        borderRight: "3px solid #404040",
        borderBottom: "3px solid #404040",
        outline: "2px solid #000",
        zIndex: "9999",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        display: "flex",
        flexDirection: "column",
        padding: "15px",
      }}
    >
      <div
        style={{
          background: opponent?.isLeaver
            ? "#008080"
            : isDraw
              ? "#000000"
              : "#000080",
          color: "#ffffff",
          padding: "5px 10px",
          marginBottom: "15px",
          fontFamily: "'Galmuri9', sans-serif",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: opponent?.isLeaver ? "2px solid #FFD700" : "none",
        }}
      >
        <span
          style={{
            color: opponent?.isLeaver ? "#FFD700" : "#ffffff",
            fontWeight: "bold",
          }}
        >
          {opponent?.isLeaver
            ? "🏆 [FORFEIT_WIN]: 축하합니다! 당신의 끈기 있는 플레이로 승리를 쟁취했습니다!"
            : isDraw
              ? "⚠ SYSTEM_ERROR: 패자를 찾지 못했습니다!"
              : "Game_Result.exe"}
        </span>
        <div style={{ display: "flex", gap: "2px" }}>
          <div
            style={{
              width: "16px",
              height: "14px",
              background: "#C0C0C0",
              border: "1px solid #000",
              color: "#000",
              fontSize: "10px",
              textAlign: "center",
              lineHeight: "12px",
            }}
          >
            _
          </div>
          <div
            style={{
              width: "16px",
              height: "14px",
              background: "#C0C0C0",
              border: "1px solid #000",
              color: "#000",
              fontSize: "10px",
              textAlign: "center",
              lineHeight: "12px",
            }}
          >
            X
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          background: "#C0C0C0",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "10px",
          borderTop: "2px solid #ffffff",
          borderLeft: "2px solid #ffffff",
          borderRight: "2px solid #808080",
          borderBottom: "2px solid #808080",
          flexShrink: 0,
          gap: "10px",
          minHeight: "260px",
        }}
      >
        <div
          style={{
            background: "#C0C0C0",
            width: getCardStyle(me, opponent).width,
            height: getCardStyle(me, opponent).height,
            padding: "2px",
            borderTop: "2px solid #808080",
            borderLeft: "2px solid #808080",
            borderRight: "2px solid #ffffff",
            borderBottom: "2px solid #ffffff",
            transition: "all 0.3s ease",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              background:
                me.score >= opponent.score && !me.isLeaver
                  ? "linear-gradient(90deg, #0000A0 0%, #0000FF 100%)"
                  : "#808080",
              color: "white",
              padding: "4px 10px",
              fontFamily: "'Galmuri9', sans-serif",
              fontSize: "14px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>
              {isDraw
                ? "Co-Winner.exe"
                : me.score > opponent.score || opponent?.isLeaver
                  ? "Winner.exe"
                  : "Loser.log"}
            </span>
            <span>
              {(() => {
                if (isDraw || me.score > opponent.score || opponent?.isLeaver) {
                  return "🏆";
                }

                return "🥈";
              })()}
            </span>
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: "10px",
              margin: 0,
              textAlign: "center",
              background: "#fff",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <li
              style={{
                fontSize:
                  getCardStyle(me, opponent).height === "240px"
                    ? "36px"
                    : "28px",
                color: "#000",
                fontFamily: "'Galmuri9', sans-serif",
              }}
            >
              {me.nickname}
            </li>
            <li
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: me.score < opponent.score ? "#808080" : "#ff0000",
                marginTop: "10px",
                fontFamily: "'Galmuri9', sans-serif",
              }}
            >
              {me.score} PTS
            </li>
          </ul>
        </div>

        {opponent && (
          <div
            style={{
              background: "#C0C0C0",
              width: getCardStyle(opponent, me).width,
              height: getCardStyle(opponent, me).height,
              padding: "2px",
              opacity: opponent.isLeaver ? 0.7 : 1,
              borderTop: "2px solid #808080",
              borderLeft: "2px solid #808080",
              borderRight: "2px solid #ffffff",
              borderBottom: "2px solid #ffffff",
              transition: "all 0.3s ease",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                background:
                  isDraw || (opponent.score > me.score && !opponent.isLeaver)
                    ? "linear-gradient(90deg, #0000A0 0%, #0000FF 100%)"
                    : "#808080",
                color: "white",
                padding: "4px 10px",
                fontFamily: "'Galmuri9', sans-serif",
                fontSize: "14px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>
                {isDraw
                  ? "Co-Winner.exe"
                  : opponent.score > me.score
                    ? "Winner.exe"
                    : "Loser.log"}
                {opponent.isLeaver && "🏳️"}
              </span>
              <span>
                {(() => {
                  if (
                    isDraw ||
                    (opponent.score > me.score && !opponent.isLeaver)
                  ) {
                    return "🏆";
                  }

                  if (opponent.isLeaver) {
                    return "👎";
                  }

                  return "🥈";
                })()}
              </span>
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: "10px",
                margin: 0,
                textAlign: "center",
                background: opponent.isLeaver ? "#e0e0e0" : "#fff",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <li
                style={{
                  fontSize:
                    getCardStyle(opponent, me).height === "240px"
                      ? "36px"
                      : "24px",
                  color: isDraw ? "#000" : "#555",
                  fontFamily: "'Galmuri9', sans-serif",
                }}
              >
                {opponent.nickname}
              </li>
              <li
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginTop: "10px",
                  color: opponent.isLeaver
                    ? "#808080"
                    : isDraw || opponent.score > me.score
                      ? "#ff0000"
                      : "#808080",
                  textDecoration: opponent.isLeaver ? "line-through" : "none",
                  fontFamily: "'Galmuri9', sans-serif",
                }}
              >
                {opponent.score} PTS
              </li>
            </ul>
          </div>
        )}
      </div>

      <div
        className="meansPanel"
        style={{ display: "flex", flex: 1, minHeight: 0 }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            margin: "25px 10px",
            padding: "15px",
            background: "#f9fafb",
            border: "2px solid #808080",
            borderRightColor: "#fff",
            borderBottomColor: "#fff",
          }}
        >
          <h3
            style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "#4a5568",
              fontFamily: "'Galmuri9', sans-serif",
            }}
          >
            내 단어장
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {myWords.length > 0 ? (
              myWords.map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    marginBottom: "10px",
                    background: "#fff",
                    borderTop: "2px solid #dfdfdf",
                    borderLeft: "2px solid #dfdfdf",
                    borderRight: "2px solid #808080",
                    borderBottom: "2px solid #808080",
                    padding: "12px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "15px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Galmuri9', sans-serif",
                      fontSize: "1.1rem",
                      minWidth: "100px",
                      color: "#000080",
                      fontWeight: "bold",
                      borderRight: "1px dashed #ccc",
                      paddingRight: "10px",
                    }}
                  >
                    {item.word}
                  </div>
                  <div style={{ flex: 1 }}>
                    {item.definitions?.map((def, dIdx) => (
                      <div
                        key={dIdx}
                        style={{
                          fontSize: "0.9rem",
                          color: "#333",
                          lineHeight: "1.5",
                          fontFamily: "'Pretendard', sans-serif",
                          marginBottom: "4px",
                        }}
                      >
                        • {def}
                      </div>
                    ))}
                  </div>
                </li>
              ))
            ) : (
              <li
                style={{
                  textAlign: "center",
                  color: "#a0aec0",
                  marginTop: "20px",
                  fontFamily: "'Galmuri9', sans-serif",
                }}
              >
                입력된 단어가 없습니다.
              </li>
            )}
          </ul>
        </div>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            margin: "25px 10px",
            padding: "15px",
            background: opponent?.isLeaver ? "#ececec" : "#f9fafb",
            border: "2px solid #808080",
            borderRightColor: "#fff",
            borderBottomColor: "#fff",
          }}
        >
          <h3
            style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "#4a5568",
              fontFamily: "'Galmuri9', sans-serif",
            }}
          >
            상대 단어장
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {opWords.length > 0 ? (
              opWords.map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    marginBottom: "10px",
                    opacity: opponent?.isLeaver ? 0.6 : 1,
                    background: "#fff",
                    borderTop: "2px solid #dfdfdf",
                    borderLeft: "2px solid #dfdfdf",
                    borderRight: "2px solid #808080",
                    borderBottom: "2px solid #808080",
                    padding: "12px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "15px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Galmuri9', sans-serif",
                      fontSize: "1.1rem",
                      minWidth: "100px",
                      color: "#000080",
                      fontWeight: "bold",
                      borderRight: "1px dashed #ccc",
                      paddingRight: "10px",
                    }}
                  >
                    {item.word}
                  </div>
                  <div style={{ flex: 1 }}>
                    {item.definitions?.map((def, dIdx) => (
                      <div
                        key={dIdx}
                        style={{
                          fontSize: "0.9rem",
                          color: "#333",
                          lineHeight: "1.5",
                          fontFamily: "'Pretendard', sans-serif",
                          marginBottom: "4px",
                        }}
                      >
                        • {def}
                      </div>
                    ))}
                  </div>
                </li>
              ))
            ) : (
              <li
                style={{
                  textAlign: "center",
                  color: "#a0aec0",
                  marginTop: "20px",
                  fontFamily: "'Galmuri9', sans-serif",
                }}
              >
                입력된 단어가 없습니다.
              </li>
            )}
          </ul>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexShrink: 0,
          paddingTop: "25px",
          marginTop: "auto",
        }}
      >
        <button
          onClick={handleRetry}
          style={{
            padding: "10px 40px",
            fontSize: "18px",
            fontFamily: "'Galmuri9', sans-serif",
            cursor: "pointer",
            backgroundColor: "#C0C0C0",
            color: "#000",
            borderTop: "2px solid #ffffff",
            borderLeft: "2px solid #ffffff",
            borderRight: "2px solid #808080",
            borderBottom: "2px solid #808080",
            outline: "1px solid #000",
            boxShadow: "inset 1px 1px 0px #dfdfdf",
          }}
        >
          다시하기(R)
        </button>
        <button
          onClick={handleExit}
          style={{
            padding: "10px 40px",
            fontSize: "18px",
            fontFamily: "'Galmuri9', sans-serif",
            cursor: "pointer",
            backgroundColor: "#C0C0C0",
            color: "#000",
            borderTop: "2px solid #ffffff",
            borderLeft: "2px solid #ffffff",
            borderRight: "2px solid #808080",
            borderBottom: "2px solid #808080",
            outline: "1px solid #000",
          }}
        >
          나가기(X)
        </button>
      </div>
    </div>
  );
};

export default ResultModal;

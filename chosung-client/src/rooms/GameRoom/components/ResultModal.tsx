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
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);
  const winner = sortedScores[0];
  const loser = sortedScores[1];

  const isDraw = winner && loser && winner.score === loser.score;

  const winnerWords = words.filter((w) => w.senderId === winner?.socketId);
  const loserWords = words.filter((w) => w.senderId === loser?.socketId);

  const handleRetry = () => {
    if (!socket) return;

    socket.emit("join-room");
    onReset();
    console.log("재입장 시도 (기존 연결 유지) ");
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
      {/* 타이틀바 */}
      <div
        style={{
          background: isDraw ? "#000000" : "#000080",
          color: isDraw ? "#FFD700" : "#ffffff",
          padding: "5px 10px",
          marginBottom: "15px",
          fontFamily: "'Galmuri9', sans-serif",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: isDraw ? "1px solid #FFD700" : "none",
        }}
      >
        <span>
          {isDraw
            ? "⚠SYSTEM_ERROR: 패자를 찾지 못했습니다!"
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
              cursor: "default",
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
              cursor: "default",
            }}
          >
            X
          </div>
        </div>
      </div>

      {/* 점수 란 */}
      <div
        style={{
          display: "flex",
          background: "#C0C0C0",
          justifyContent: "space-around",
          padding: "10px",
          borderTop: "2px solid #ffffff",
          borderLeft: "2px solid #ffffff",
          borderRight: "2px solid #808080",
          borderBottom: "2px solid #808080",
          flexShrink: 0,
        }}
      >
        {/* 승자 패널 */}
        <div
          style={{
            background: "#C0C0C0",
            width: "45%",
            padding: "2px",
            borderTop: "2px solid #808080",
            borderLeft: "2px solid #808080",
            borderRight: "2px solid #ffffff",
            borderBottom: "2px solid #ffffff",
          }}
        >
          <div
            style={{
              background: "linear-gradient(90deg, #0000A0 0%, #0000FF 100%)",
              color: "white",
              padding: "4px 10px",
              textAlign: "left",
              fontFamily: "'Galmuri9', sans-serif",
              fontSize: "14px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{isDraw ? "Co-Winner.exe" : "Winner.exe"}</span>
            <span>🏆</span>
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: "20px",
              margin: 0,
              textAlign: "center",
              background: "#fff",
            }}
          >
            <li
              style={{
                fontSize: "28px",
                color: "#000",
                fontFamily: "'Galmuri9', sans-serif",
                textShadow: "1px 1px 0 #ccc",
              }}
            >
              {winner?.nickname}
            </li>
            <li
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                color: "#ff0000",
                marginTop: "5px",
              }}
            >
              {winner?.score} PTS
            </li>
          </ul>
        </div>

        {/* 패자 패널 */}
        {loser && (
          <div
            style={{
              background: "#C0C0C0",
              width: "45%",
              padding: "2px",
              borderTop: "2px solid #808080",
              borderLeft: "2px solid #808080",
              borderRight: "2px solid #ffffff",
              borderBottom: "2px solid #ffffff",
            }}
          >
            <div
              style={{
                background: isDraw
                  ? "linear-gradient(90deg, #0000A0 0%, #0000FF 100%)"
                  : "#808080",
                color: isDraw ? "white" : "#C0C0C0",
                padding: "4px 10px",
                textAlign: "left",
                fontFamily: "'Galmuri9', sans-serif",
                fontSize: "14px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>{isDraw ? "Co-Winner.exe" : "Loser.log"}</span>
              <span>{isDraw ? "🏆" : "🥈"}</span>
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: "20px",
                margin: 0,
                textAlign: "center",
                background: "#fff",
              }}
            >
              <li
                style={{
                  fontSize: isDraw ? "28px" : "24px",
                  color: isDraw ? "#000" : "#555",
                  fontFamily: "'Galmuri9', sans-serif",
                }}
              >
                {loser.nickname}
              </li>
              <li
                style={{
                  fontSize: isDraw ? "22px" : "20px",
                  color: isDraw ? "#ff0000" : "#808080",
                  marginTop: "5px",
                  fontWeight: isDraw ? "bold" : "normal",
                }}
              >
                {loser.score} PTS
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* 2. 단어장 칸 */}
      <div
        className="meansPanel"
        style={{ display: "flex", flex: 1, minHeight: 0 }}
      >
        {/* 승자단어장 */}
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
            {winner?.nickname} 단어장
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {winnerWords.length > 0 ? (
              winnerWords.map((item, idx) => (
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

        {/* 패자 단어장 */}
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
            {loser?.nickname} 단어장
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {loserWords.length > 0 ? (
              loserWords.map((item, idx) => (
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
      </div>

      {/* 3. 버튼 칸 */}
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

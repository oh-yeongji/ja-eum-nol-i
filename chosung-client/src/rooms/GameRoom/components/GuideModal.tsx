import React, { useState, useEffect } from "react";
import CommonHeader from "./CommonHeader/CommonHeader";

interface GuideModalProps {
  onConfirm: (skipChecked: boolean) => void;
}

const GuideModal = ({ onConfirm }: GuideModalProps) => {
  const [skip, setSkip] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft === 0) {
      onConfirm(skip);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onConfirm, skip]);

  return (
    <div style={styles.overlay}>
      <div style={styles[`main-window`]}>
        <CommonHeader title="[정보] 도움말 - Help.exe" />

        <div style={styles.contentContainer}>
          <h2 style={styles.header}>자음 놀이 이용 안내</h2>

          <div style={styles.textBox}>
            <p style={styles.textLine}>• 동음이의어는 불허합니다.</p>
            <p style={styles.textLine}>
              • 방 입장 후 재접속(새로고침) 시 강제 퇴장 처리되오니
              주의하십시오.
            </p>
            <p style={styles.textLine}>
              • 게임 진행 중 재접속(새로고침)은 비신사적인 행위로 간주하여
              <span style={{ color: "red" }}> 자동 기권패</span>로 처리됩니다.
            </p>
            <p style={styles.textLine}>
              • 기본 대결 시간은 60초이며, 방장(첫입장자)의 설정에 따라
              30/60/90/120초로 가변 가능합니다.
            </p>
            <p style={styles.textLine}>
              • 별호(닉네임) 변경은 일일 1회로 제한되오니 신중을 기해주시기
              바랍니다.
            </p>
          </div>

          <div style={styles.statusLine}>
            {timeLeft}초 뒤 이 창이 자동으로 닫힙니다...
          </div>

          <div style={styles.footer}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={skip}
                onChange={(e) => setSkip(e.target.checked)}
                style={{
                  ...styles.checkbox,
                  backgroundImage: skip
                    ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath d='M2 5l2 2 4-4' stroke='black' stroke-width='2' fill='none'/%3E%3C/svg%3E")`
                    : "none",
                  backgroundSize: "12px",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              />
              ▶ 다시 보지 않기 (Skip)
            </label>
            <button style={styles.confirmBtn} onClick={() => onConfirm(skip)}>
              확인 (Enter)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 9999,
  },
  "main-window": {
    width: "650px",
    fontFamily: "'돋움', 'Dotum', 'AppleGothic', sans-serif",
    border: "3px solid",
    backgroundColor: "#c0c0c0",
    borderColor: "#ffffff #808080 #808080 #ffffff",
    padding: "2px",
    imageRendering: "pixelated",
    letterSpacing: "-0.5px",
  },

  contentContainer: {
    padding: "25px",
    backgroundColor: "#c0c0c0",
  },
  header: {
    textAlign: "center",
    color: "#000",
    fontSize: "22px",
    textDecoration: "underline",
    textUnderlineOffset: "5px",
    marginBottom: "20px",
  },
  textBox: {
    padding: "20px",
    lineHeight: "1.8",
    fontSize: "15px",
    color: "#000",
    marginBottom: "15px",
    backgroundColor: "#fff",
    border: "2px inset #808080",
  },
  textLine: {
    margin: "8px 0",
  },
  statusLine: {
    fontSize: "12px",
    textAlign: "center",
    color: "#444",
    marginBottom: "20px",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    cursor: "pointer",
  },
  checkbox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "16px",
    height: "16px",
    position: "relative",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    border: "1px solid",
    marginBottom: "5px",
    borderColor: "#808080 #ffffff #ffffff #808080",
    boxShadow: "inset 1px 1px 0px #000 inset -1px -1px 0px #c0c0c0",
  },
  confirmBtn: {
    padding: "6px 25px",
    fontSize: "14px",
    fontWeight: "bold",
    backgroundColor: "#c0c0c0",
    border: "2px solid",
    borderColor: "#ffffff #505050 #505050 #ffffff",
    cursor: "pointer",
  },
};

export default GuideModal;

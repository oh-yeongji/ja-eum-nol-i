import { useEffect, useState, useRef } from "react";
import { socket } from "@/socket/socket";
import CommonHeader from "../CommonHeader/CommonHeader";
import styles from "./NicknameModal.module.css";

interface NicknameModalProps {
  onClose: () => void;
  onConfirm: (nickname: string) => void;
}

const NicknameModal = ({ onClose, onConfirm }: NicknameModalProps) => {
  const [nickname, setNickname] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCheckDup = () => {
    const trimmed = nickname.trim();
    if (trimmed.length < 2 || trimmed.length > 8) {
      alert("닉네임은 2~8자 를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setIsChecked(false);

    socket.emit("check-nickname", { nickname: trimmed });
  };

  const handleConfirmClick = () => {
    if (!isChecked || !isAvailable) {
      alert("닉네임 중복 검사를 먼저 해주십시오.");
      return;
    }
    onConfirm(nickname.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (e.key === "Enter") {
      e.preventDefault();

      if (isLoading) return;

      if (!isChecked || !isAvailable) {
        handleCheckDup();
      } else {
        handleConfirmClick();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setIsChecked(false);
    setIsAvailable(false);
  };

  useEffect(() => {
    socket.on(
      "nickname-check-result",
      (data: { available: boolean; message: string }) => {
        setIsLoading(false);
        setIsChecked(true);
        setIsAvailable(data.available);
        setServerMessage(data.message);
      },
    );

    return () => {
      socket.off("nickname-check-result");
    };
  }, []);

  return (
    <div className={styles.nicknameModalOverlay}>
      <div className={styles.nicknameModalwindow}>
        <CommonHeader title="닉네임 설정" onClose={onClose} />
        <div className={styles.nicknameModalContent}>
          <div className={styles.nicknameInputContainer}>
            <input
              ref={inputRef}
              type="text"
              placeholder="닉네임 입력"
              value={nickname}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              className={`${styles.dupCheck} ${isChecked && isAvailable ? styles.checked : ""}`}
              onClick={handleCheckDup}
              disabled={isLoading}
            >
              {isLoading ? "중복검사 중..." : "중복검사"}
            </button>
          </div>

          <div className={styles.dupMessage}>
            {isLoading && (
              <span className={styles.loadingMessage}>
                중복 검사 중입니다...
              </span>
            )}

            {!isLoading && isChecked && (
              <span className={isAvailable ? styles.available : styles.dup}>
                {serverMessage}
              </span>
            )}
          </div>
          <div className={styles.nicknameRule}>
            사용 가능: 한글/영문(대소문자) 2~8자,
            <br />
            특수문자( - _ *)
          </div>
          <div className={styles.btns}>
            <button
              disabled={!isChecked || !isAvailable || isLoading}
              className={`${styles.confirmBtn} ${!isAvailable || !isChecked || isLoading ? "disabled" : ""}`}
              onClick={handleConfirmClick}
            >
              설정
            </button>
            <button className={styles.cancelBtn} onClick={onClose}>
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NicknameModal;

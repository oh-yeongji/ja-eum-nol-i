import React, { useState, useEffect } from "react";

interface GuideModalProps {
  onConfirm: (skipChecked: boolean) => void;
}

const GuideModal = ({ onConfirm }: GuideModalProps) => {
  const [skip, setSkip] = useState(false);

  return (
    <div
      style={{
        width: "1400px",
        height: "700px",
        background: "#fff",
        position: "relative",
        left: "200px",
      }}
    >
      <h2>게임설명</h2>
      초성게임은 명사만 가능합니다. 동음이의어는 허용하지않습니다. 새로고침을
      하면 방에서 나가게 됩니다.
      <div>5초뒤 사라집니다.</div>
      <button onClick={() => onConfirm(skip)}>확인</button>
      <label>
        <input
          type="checkbox"
          checked={skip}
          onChange={(e) => setSkip(e.target.checked)}
        />
        다시 보지않기
      </label>
    </div>
  );
};

export default GuideModal;

import { useState } from "react";
import { getChosung, checkWord } from "../api/game";

import Timer from "./Timer";
const CenterPlay = () => {
  const [word, setWord] = useState("");
  const [alert, setAlert] = useState<string | null>(null);

  const [firstCho, setFirstCho] = useState("?");
  const [secondCho, setSecondCho] = useState("?");

  const showAlert = (msg: string) => {
    setAlert(msg);
    setTimeout(() => setAlert(null), 1500);
  };

  const handleSubmit = async () => {
    const trimmed = word.replace(/\s/g, "");
    if (trimmed.length === 0) {
      showAlert("단어를 입력하세요");
      return;
    }

    if (!/^[가-힣]+$/.test(trimmed)) {
      showAlert("잘못된 단어입니다.");
      return;
    }

    if (trimmed.length !== 2) {
      showAlert("두 글자만 입력 가능합니다.");
      return;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        className="chosungContainer"
        style={{ padding: "20px", background: "brown" }}
      >
        <div
          className="chosungScreen"
          style={{
            width: "200px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            className="firstCho"
            style={{
              fontSize: "40px",
              width: "70px",
              height: "70px",
              background: "#ddd",
              textAlign: "center",
            }}
          >
            {firstCho}
          </div>
          <div
            className="secondCho"
            style={{
              fontSize: "40px",
              width: "70px",
              height: "70px",
              background: "#ddd",
              textAlign: "center",
            }}
          >
            {secondCho}
          </div>
        </div>
        <div className="inputContainer">
          {alert && <div className="chosung-alert">{alert}</div>}
          <div className="inputGroup" style={{ display: "flex" }}>
            <input
              className="wordInput"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <div className="submitBtn" onClick={handleSubmit}>
              엔터
            </div>
          </div>
        </div>
      </div>

      <Timer />
    </div>
  );
};
export default CenterPlay;

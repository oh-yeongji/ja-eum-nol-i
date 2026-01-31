import { GameEndData } from "@/types/domain/room";

const ResultModal = ({scores}:{scores:GameEndData["scores"]}) => {
  
  const sortedScores=[...scores].sort((a,b)=>b.score-a.score);
  const winner = sortedScores[0];
const loser = sortedScores[1];
  
  return (
    <div
      style={{
        position: "fixed",
        top: "50px",
        left: "25%",
        width: "800px",
        height: "650px",
        background: "#fff",
        zIndex: "9999",
      }}
    >
      <div
        className="scorePanel"
        style={{
          display: "flex",
          background: "#9db8d4",
          justifyContent: "space-around",
        }}
      >
        <ul
          className="winner"
          style={{
            listStyle: "none",
            background: "#fff",
            width: "300px",
            height: "250px",
            padding: 0,
          }}
        >
          <li style={{ fontSize: "30px" }}>승자</li>
          <li className="winnerNickname" style={{ fontSize: "20px" }}>
           {winner?.nickname}
          </li>
          <li className="winnerScore" style={{ fontSize: "20px" }}>
      {winner?.score}점
          </li>
        </ul>


       {loser&&( <ul
          className="loser"
          style={{
            background: "#fff",
            width: "300px",
            height: "250px",
            listStyle: "none",
            padding: "0",
          }}
        >
          <li style={{ fontSize: "30px" }}>패자</li>
          <li className="loserNickname" style={{ fontSize: "20px" }}>
           {loser.nickname}
          </li>
          <li className="loserScore" style={{ fontSize: "20px" }}>
         {loser?.score}점
          </li>
        </ul>)}
      </div>
      <div
        className="totalWordMean"
        style={{ display: "flex", justifyContent: "space-around" }}
      >
        <ul
          className="winner"
          style={{ background: "#ccc", width: "300px", height: "250px" }}
        >
          승자 단어뜻
        </ul>
        <ul
          className="loser"
          style={{ background: "#ccc", width: "300px", height: "250px" }}
        >
          <div>파묘</div>
          <div>
            어떤 사람이나 존재를 몹시 아끼고 귀중히 여기는 마음. 또는 그런 일.
          </div>
        </ul>
      </div>
      <div
        className="btns"
        style={{ display: "flex", justifyContent: "space-around" }}
      >
        <button className="retry"> 다시하기</button>
        <button className="leave">나가기</button>
      </div>
    </div>
  );
};

export default ResultModal;

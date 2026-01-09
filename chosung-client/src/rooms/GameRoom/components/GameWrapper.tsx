import PlayerPanel from "./PlayerPanel/PlayerPanel";
import CenterPlay from "./CenterPlay/CenterPlay";

interface GameWrapeprProps {
  addPlayerWord: (word: string) => void;
  playerWords: string[];
}

const GameWrapper = ({ addPlayerWord, playerWords }: GameWrapeprProps) => {
  return (
    <div
      className="game-wrapper"
      style={{
        width: "1200px",
        height: "700px",
        display: "flex",
        justifyContent: "space-between",
        background: "#fff",
        borderRadius: "25px",
        zIndex: "9",
      }}
    >
      <PlayerPanel words={playerWords} />
      <CenterPlay addPlayerWord={addPlayerWord} />
      <PlayerPanel words={playerWords} />
    </div>
  );
};
export default GameWrapper;

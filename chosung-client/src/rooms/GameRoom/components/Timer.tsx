interface TimerProps {
  timeLeftMs: number;
}

const Timer = ({ timeLeftMs }: TimerProps) => {
  const totalSec = Math.floor(timeLeftMs / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  const mm = String(min).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");

  return (
    <>
      <div style={{ height: "200px", background: "#ccc" }}>
        {mm}:{ss}
      </div>
    </>
  );
};
export default Timer;

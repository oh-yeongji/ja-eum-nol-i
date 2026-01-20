interface TimerProps {
  timeLeftMs: number;
}

const Timer = ({ timeLeftMs }: TimerProps) => {
  const sec = Math.ceil(timeLeftMs / 1000);

  return (
    <>
      <div style={{ height: "200px", background: "#ccc" }}>:{sec}</div>
    </>
  );
};
export default Timer;

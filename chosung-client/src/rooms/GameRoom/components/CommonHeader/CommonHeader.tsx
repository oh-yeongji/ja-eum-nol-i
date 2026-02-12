import styles from "./CommonHeader.module.css";

interface CommonHeaderProps {
  title: string;
  style?: React.CSSProperties;
  onClose?: () => void;
}
const CommonHeader = ({ title, style, onClose }: CommonHeaderProps) => {
  return (
    <div className={styles.header} style={style}>
      <span className={styles.titleName}>{title}</span>
      <button className={styles.closeBtn} onClick={onClose}>
        X
      </button>
    </div>
  );
};
export default CommonHeader;

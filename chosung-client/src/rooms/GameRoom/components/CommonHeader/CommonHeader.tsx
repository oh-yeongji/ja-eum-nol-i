import styles from "./CommonHeader.module.css";

interface CommonHeaderProps {
  title: string;
  onClose?: () => void;
}
const CommonHeader = ({ title, onClose }: CommonHeaderProps) => {
  return (
    <div className={styles.header}>
      <span className={styles.titleName}>{title}</span>
      <button className={styles.closeBtn} onClick={onClose}>
        X
      </button>
    </div>
  );
};
export default CommonHeader;

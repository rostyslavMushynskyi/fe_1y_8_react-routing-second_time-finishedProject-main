import styles from "./MovieCardSkeleton.module.css";

export default function MovieCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.poster} />
      <div className={styles.meta}>
        <div className={styles.title} />
        <div className={styles.subtitle} />
      </div>
    </div>
  );
}

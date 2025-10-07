// ===========================
// Loading Fallback Component
// ©AngelaMos | 2025
// ===========================

import styles from './LoadingFallback.module.scss';

export const LoadingFallback = (): React.JSX.Element => (
  <div className={styles.loadingContainer}>
    <div className={styles.loadingText}>LOADING...</div>
    <div className={styles.loadingBar}>
      <div className={styles.loadingBarTrack}>
        <div className={styles.loadingBarFill} />
      </div>
    </div>
  </div>
);

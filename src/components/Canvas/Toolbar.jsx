import { ArrowLeft, Maximize, Minimize } from 'lucide-react';
import styles from './Toolbar.module.css';

export default function Toolbar({ pageName, isFullscreen, onToggleFullscreen, onBack }) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <button type="button" className={styles.iconBtn} onClick={onBack} aria-label="Tilbake til dashbord">
          <ArrowLeft size={18} />
        </button>
        <span className={styles.pageName}>{pageName}</span>
      </div>

      <div className={styles.right}>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={onToggleFullscreen}
          aria-label="Slå av/på fullskjerm"
          title="Fullskjerm"
        >
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
      </div>
    </div>
  );
}

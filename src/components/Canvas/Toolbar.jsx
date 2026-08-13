import { ArrowLeft, Grid2x2, Maximize, Minimize, ZoomIn, ZoomOut } from 'lucide-react';
import styles from './Toolbar.module.css';

const ZOOM_STEP = 0.1;

export default function Toolbar({
  pageName,
  isFullscreen,
  onToggleFullscreen,
  onBack,
  zoom,
  onZoomChange,
  snapToGrid,
  onToggleSnapToGrid,
}) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <button type="button" className={styles.iconBtn} onClick={onBack} aria-label="Tilbake til dashbord">
          <ArrowLeft size={18} />
        </button>
        <span className={styles.pageName}>{pageName}</span>
      </div>

      <div className={styles.right}>
        <div className={styles.zoomControl}>
          <button
            type="button"
            className={styles.zoomStepBtn}
            onClick={() => onZoomChange(zoom - ZOOM_STEP)}
            aria-label="Zoom ut"
          >
            <ZoomOut size={16} />
          </button>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={zoom}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className={styles.zoomSlider}
            aria-label="Zoom lerretet"
          />
          <button
            type="button"
            className={styles.zoomStepBtn}
            onClick={() => onZoomChange(zoom + ZOOM_STEP)}
            aria-label="Zoom inn"
          >
            <ZoomIn size={16} />
          </button>
          <span className={styles.zoomLabel}>{Math.round(zoom * 100)}%</span>
        </div>

        <button
          type="button"
          className={`${styles.iconBtn} ${snapToGrid ? styles.iconBtnActive : ''}`}
          onClick={onToggleSnapToGrid}
          aria-pressed={snapToGrid}
          aria-label="Fest widgetene til rutenettet"
          title="Fest til rutenett"
        >
          <Grid2x2 size={18} />
        </button>

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

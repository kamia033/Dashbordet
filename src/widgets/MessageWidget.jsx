import styles from './MessageWidget.module.css';

const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 72;

export default function MessageWidget({ data, onChange }) {
  const fontSize = data.fontSize ?? 24;

  return (
    <div className={styles.message}>
      <textarea
        className={styles.text}
        style={{ fontSize: `${fontSize}px` }}
        value={data.text ?? ''}
        placeholder="Skriv en beskjed..."
        onChange={(e) => onChange({ text: e.target.value })}
      />
      <div className={`${styles.sizeControl} widget-hover-controls`}>
        <span className={styles.sizeLabelSmall}>Aa</span>
        <input
          type="range"
          min={MIN_FONT_SIZE}
          max={MAX_FONT_SIZE}
          value={fontSize}
          onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
          className={styles.sizeSlider}
          aria-label="Endre tekststørrelse"
        />
        <span className={styles.sizeLabelBig}>Aa</span>
      </div>
    </div>
  );
}

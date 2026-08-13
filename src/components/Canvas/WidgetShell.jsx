import styles from './WidgetShell.module.css';

export default function WidgetShell({ icon: Icon, title, color, onDelete, children }) {
  return (
    <div className={styles.shell} style={{ '--widget-color': color }}>
      <div className={`${styles.header} widget-drag-handle`}>
        <div className={styles.headerLeft}>
          {Icon && <Icon size={16} />}
          <span className={styles.headerTitle}>{title}</span>
        </div>
        <button
          type="button"
          className={styles.deleteBtn}
          onClick={onDelete}
          aria-label={`Slett ${title}`}
        >
          ×
        </button>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}

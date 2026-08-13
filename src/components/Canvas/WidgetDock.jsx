import { WIDGET_REGISTRY } from '../../widgets/registry.js';
import styles from './WidgetDock.module.css';

export default function WidgetDock({ onAdd }) {
  return (
    <div className={styles.dock}>
      {WIDGET_REGISTRY.map((def) => (
        <button
          key={def.type}
          type="button"
          className={styles.dockItem}
          onClick={() => onAdd(def.type)}
          title={`Legg til ${def.label.toLowerCase()}`}
        >
          <def.icon size={22} />
          <span className={styles.dockLabel}>{def.label}</span>
        </button>
      ))}
    </div>
  );
}

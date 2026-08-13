import { Plus, X } from 'lucide-react';
import { createId } from '../utils/id.js';
import styles from './GoalWidget.module.css';

export default function GoalWidget({ data, onChange }) {
  const lines = data.lines ?? [];

  function updateLine(id, text) {
    onChange({ lines: lines.map((line) => (line.id === id ? { ...line, text } : line)) });
  }

  function addLine() {
    onChange({ lines: [...lines, { id: createId(), text: '' }] });
  }

  function removeLine(id) {
    onChange({ lines: lines.filter((line) => line.id !== id) });
  }

  return (
    <div className={styles.goal}>
      <h3 className={styles.title}>{data.title}</h3>
      <div className={styles.bubbles}>
        {lines.map((line) => (
          <div key={line.id} className={styles.bubble}>
            <input
              className={styles.bubbleInput}
              type="text"
              placeholder="Skriv her..."
              value={line.text}
              onChange={(e) => updateLine(line.id, e.target.value)}
            />
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => removeLine(line.id)}
              aria-label="Fjern linje"
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" className={styles.addBtn} onClick={addLine}>
        <Plus size={15} />
        Legg til linje
      </button>
    </div>
  );
}

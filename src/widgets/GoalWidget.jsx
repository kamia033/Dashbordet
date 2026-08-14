import { useEffect, useRef } from 'react';
import { Plus, X } from 'lucide-react';
import { createId } from '../utils/id.js';
import styles from './GoalWidget.module.css';

export default function GoalWidget({ data, onChange }) {
  const lines = data.lines ?? [];
  const inputRefs = useRef([]);
  const focusIndexRef = useRef(null);

  useEffect(() => {
    if (focusIndexRef.current !== null) {
      inputRefs.current[focusIndexRef.current]?.focus();
      focusIndexRef.current = null;
    }
  }, [lines.length]);

  function updateLine(id, text) {
    onChange({ lines: lines.map((line) => (line.id === id ? { ...line, text } : line)) });
  }

  function addLine() {
    focusIndexRef.current = lines.length;
    onChange({ lines: [...lines, { id: createId(), text: '' }] });
  }

  function removeLine(id) {
    onChange({ lines: lines.filter((line) => line.id !== id) });
  }

  return (
    <div className={styles.goal}>
     
      <div className={styles.bubbles}>
        {lines.map((line, index) => (
          <div key={line.id} className={styles.bubble}>
            <input
              ref={(el) => (inputRefs.current[index] = el)}
              className={styles.bubbleInput}
              type="text"
              placeholder="Skriv her..."
              value={line.text}
              onChange={(e) => updateLine(line.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addLine();
                }
              }}
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
      <button type="button" className={`${styles.addBtn} widget-hover-controls`} onClick={addLine}>
        <Plus size={15} />
        Legg til linje
      </button>
    </div>
  );
}

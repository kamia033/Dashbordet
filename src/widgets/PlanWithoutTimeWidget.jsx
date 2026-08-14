import { useEffect, useRef } from 'react';
import { Plus, X } from 'lucide-react';
import { createId } from '../utils/id.js';
import styles from './ScheduleWidget.module.css';

export default function PlanWithoutTimeWidget({ data, onChange }) {
  const items = data.items ?? [];
  const inputRefs = useRef([]);
  const focusIndexRef = useRef(null);

  useEffect(() => {
    if (focusIndexRef.current !== null) {
      inputRefs.current[focusIndexRef.current]?.focus();
      focusIndexRef.current = null;
    }
  }, [items.length]);

  function updateRow(id, value) {
    onChange({ items: items.map((row) => (row.id === id ? { ...row, tekst: value } : row)) });
  }

  function addRow() {
    focusIndexRef.current = items.length;
    onChange({ items: [...items, { id: createId(), tekst: '' }] });
  }

  function removeRow(id) {
    onChange({ items: items.filter((row) => row.id !== id) });
  }

  function handleEnter(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRow();
    }
  }

  return (
    <div className={styles.schedule}>
      
      <div className={styles.rows}>
        {items.map((row, index) => (
          <div key={row.id} className={styles.row}>
            <input
              ref={(el) => (inputRefs.current[index] = el)}
              className={styles.text}
              type="text"
              placeholder="Aktivitet"
              value={row.tekst ?? ''}
              onChange={(e) => updateRow(row.id, e.target.value)}
              onKeyDown={handleEnter}
            />
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => removeRow(row.id)}
              aria-label="Fjern rad"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" className={`${styles.addBtn} widget-hover-controls`} onClick={addRow}>
        <Plus size={16} />
        Legg til rad
      </button>
    </div>
  );
}
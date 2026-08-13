import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import styles from './ColumnList.module.css';

/**
 * Generisk, gjenbrukbar kolonne for trekkspill-navigasjonen (fag -> mapper -> sider).
 * Ny kolonne dukker opp til høyre for hvert valg, som i et klassisk filutforsker-kolonnevisning.
 */
export default function ColumnList({
  title,
  icon: Icon,
  items,
  activeId,
  onSelect,
  onDelete,
  deleteLabel,
  onCreate,
  onCreateClick,
  createPlaceholder = 'Navn...',
  emptyText = 'Ingen ennå',
}) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');

  function handleAddClick() {
    if (onCreateClick) {
      onCreateClick();
      return;
    }
    setShowForm((v) => !v);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName('');
    setShowForm(false);
  }

  return (
    <div className={styles.column}>
      <div className={styles.header}>
        <span>{title}</span>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={handleAddClick}
          aria-label={`Ny ${title.toLowerCase()}`}
          title={`Ny ${title.toLowerCase()}`}
        >
          <Plus size={16} />
        </button>
      </div>

      {showForm && (
        <form className={styles.newForm} onSubmit={handleSubmit}>
          <input
            className={styles.newInput}
            type="text"
            autoFocus
            placeholder={createPlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className={styles.newSubmit} type="submit">
            Opprett
          </button>
        </form>
      )}

      <div className={styles.list}>
        {items.length === 0 && <p className={styles.emptyHint}>{emptyText}</p>}
        {items.map((item) => (
          <div
            key={item.id}
            className={`${styles.item} ${item.id === activeId ? styles.itemActive : ''}`}
            onClick={() => onSelect(item)}
            role="button"
            tabIndex={0}
          >
            <Icon size={16} />
            <span className={styles.itemName}>{item.name}</span>
            {item.meta && <span className={styles.itemMeta}>{item.meta}</span>}
            <span
              role="button"
              tabIndex={0}
              className={styles.deleteBtn}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
              aria-label={deleteLabel ? deleteLabel(item) : `Slett ${item.name}`}
            >
              <Trash2 size={14} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

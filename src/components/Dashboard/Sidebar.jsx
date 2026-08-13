import { BookOpen } from 'lucide-react';
import { useAppStore } from '../../store/useStore.js';
import ColumnList from './ColumnList.jsx';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const subjects = useAppStore((s) => s.subjects);
  const currentSubjectId = useAppStore((s) => s.currentSubjectId);
  const addSubject = useAppStore((s) => s.addSubject);
  const deleteSubject = useAppStore((s) => s.deleteSubject);
  const selectSubject = useAppStore((s) => s.selectSubject);

  const items = subjects.map((subject) => ({
    id: subject.id,
    name: subject.name,
    meta: `${subject.folders.length} mappe(r)`,
  }));

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <h1 className={styles.brandTitle}>Vikaoppstart</h1>
      </div>

      <ColumnList
        title="Fag"
        icon={BookOpen}
        items={items}
        activeId={currentSubjectId}
        onSelect={(item) => selectSubject(item.id)}
        onDelete={(item) => deleteSubject(item.id)}
        deleteLabel={(item) => `Slett faget ${item.name}`}
        onCreate={(name) => selectSubject(addSubject(name))}
        createPlaceholder="Navn på fag"
        emptyText="Ingen fag ennå"
      />
    </aside>
  );
}

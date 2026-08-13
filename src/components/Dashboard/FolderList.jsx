import { Folder } from 'lucide-react';
import { useAppStore } from '../../store/useStore.js';
import ColumnList from './ColumnList.jsx';
import styles from './Column.module.css';

export default function FolderList({ subject }) {
  const currentFolderId = useAppStore((s) => s.currentFolderId);
  const addFolder = useAppStore((s) => s.addFolder);
  const deleteFolder = useAppStore((s) => s.deleteFolder);
  const selectFolder = useAppStore((s) => s.selectFolder);

  const items = subject.folders.map((folder) => ({
    id: folder.id,
    name: folder.name,
    meta: `${folder.pages.length} side(r)`,
  }));

  return (
    <div className={styles.columnWrap}>
      <ColumnList
        title="Mapper"
        icon={Folder}
        items={items}
        activeId={currentFolderId}
        onSelect={(item) => selectFolder(item.id)}
        onDelete={(item) => deleteFolder(subject.id, item.id)}
        deleteLabel={(item) => `Slett mappen ${item.name}`}
        onCreate={(name) => selectFolder(addFolder(subject.id, name))}
        createPlaceholder="Navn på mappe"
        emptyText="Ingen mapper ennå"
      />
    </div>
  );
}

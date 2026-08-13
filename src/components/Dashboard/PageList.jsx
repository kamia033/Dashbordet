import { useState } from 'react';
import { FileText } from 'lucide-react';
import { useAppStore } from '../../store/useStore.js';
import ColumnList from './ColumnList.jsx';
import NewPageModal from './NewPageModal.jsx';
import styles from './Column.module.css';

export default function PageList({ subject, folder }) {
  const deletePage = useAppStore((s) => s.deletePage);
  const openPage = useAppStore((s) => s.openPage);
  const [showModal, setShowModal] = useState(false);

  const items = folder.pages.map((page) => ({
    id: page.id,
    name: page.name,
    meta: `${page.widgets.length} widget(er)`,
  }));

  return (
    <div className={styles.columnWrap}>
      <ColumnList
        title="Sider"
        icon={FileText}
        items={items}
        onSelect={(item) => openPage(subject.id, folder.id, item.id)}
        onDelete={(item) => deletePage(subject.id, folder.id, item.id)}
        deleteLabel={(item) => `Slett siden ${item.name}`}
        onCreateClick={() => setShowModal(true)}
        emptyText="Ingen sider ennå"
      />

      {showModal && (
        <NewPageModal subjectId={subject.id} folderId={folder.id} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

import { useAppStore } from '../../store/useStore.js';
import Sidebar from './Sidebar.jsx';
import FolderList from './FolderList.jsx';
import PageList from './PageList.jsx';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const subjects = useAppStore((s) => s.subjects);
  const currentSubjectId = useAppStore((s) => s.currentSubjectId);
  const currentFolderId = useAppStore((s) => s.currentFolderId);

  const currentSubject = subjects.find((s) => s.id === currentSubjectId) ?? null;
  const currentFolder = currentSubject?.folders.find((f) => f.id === currentFolderId) ?? null;

  return (
    <div className={styles.layout}>
      <Sidebar />

      {currentSubject && <FolderList subject={currentSubject} />}
      {currentSubject && currentFolder && <PageList subject={currentSubject} folder={currentFolder} />}

      <div className={styles.filler}>
        {!currentSubject && <p className={styles.hint}>Velg et fag til venstre for å se mapper.</p>}
        {currentSubject && !currentFolder && (
          <p className={styles.hint}>Velg en mappe for å se sidene i den.</p>
        )}
      </div>
    </div>
  );
}

import { useAppStore } from '../../store/useStore.js';
import Sidebar from './Sidebar.jsx';
import PageList from './PageList.jsx';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const subjects = useAppStore((s) => s.subjects);
  const currentSubjectId = useAppStore((s) => s.currentSubjectId);

  const currentSubject = subjects.find((s) => s.id === currentSubjectId) ?? null;

  return (
    <div className={styles.layout}>
      <Sidebar />

      {currentSubject && <PageList subject={currentSubject} />}

      <div className={styles.filler}>
        {!currentSubject && <p className={styles.hint}>Velg et fag til venstre for å se sidene.</p>}
      </div>
    </div>
  );
}

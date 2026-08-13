import { useEffect } from 'react';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Canvas from './components/Canvas/Canvas.jsx';
import { useAppStore } from './store/useStore.js';
import styles from './App.module.css';

export default function App() {
  const view = useAppStore((s) => s.view);
  const hydrate = useAppStore((s) => s.hydrate);
  const hasHydrated = useAppStore((s) => s.hasHydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hasHydrated) {
    return (
      <div className={styles.loading}>
        <p>Laster inn...</p>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      {view === 'dashboard' ? <Dashboard /> : <Canvas />}
    </div>
  );
}

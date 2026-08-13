import { useEffect, useState } from 'react';
import styles from './ClockWidget.module.css';

export default function ClockWidget() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(interval);
  }, []);

  const time = now.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className={styles.clock}>
      <p className={styles.time}>{time}</p>
      <p className={styles.date}>{date}</p>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import styles from './CountdownWidget.module.css';

//importing icons
import { Plus, Minus, Pause, Play, X } from 'lucide-react';

function clampSeconds(value) {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.floor(value));
}

export default function CountdownWidget({ data, onChange }) {
    const initialTime = useMemo(() => clampSeconds(data?.time ?? 300), [data?.time]);
    const [remainingTime, setRemainingTime] = useState(initialTime);
    const [startTime, setStartTime] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);

    // Reset remainingTime and startTime when initialTime changes
    useEffect(() => {
        setRemainingTime(initialTime);
        setStartTime(initialTime);
    }, [initialTime]);

    // Countdown logic. This effect runs when isRunning or remainingTime changes. 
    // If the countdown is running and there's time left, it sets up an interval to decrement the remaining time every second. 
    // When the component unmounts or the dependencies change, it clears the interval to prevent memory leaks.
    useEffect(() => {
        if (!isRunning || remainingTime <= 0) return undefined;

        const interval = setInterval(() => {
            setRemainingTime((prevTime) => Math.max(prevTime - 1, 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, remainingTime]);

    // This effect runs when remainingTime, isRunning, data?.time, or onChange changes.
    // It checks if the countdown has reached zero while running, and if so, stops the countdown.
    // It also checks if the persisted time in data is different from the current remaining time, and if so, calls onChange to update the parent component.
    useEffect(() => {
        if (remainingTime === 0 && isRunning) {
            setIsRunning(false);
        }

        const persistedTime = clampSeconds(data?.time ?? 0);
        if (persistedTime !== remainingTime) {
            onChange?.({ time: remainingTime });
        }
    }, [remainingTime, isRunning, data?.time, onChange]);

    function addMinute() {
            setRemainingTime((prevTime) => prevTime + 60);
            setStartTime((prevTime) => prevTime + 60);
    }
    
    function subtractMinute() {
            setRemainingTime((prevTime) => Math.max(prevTime - 60, 0));
            setStartTime((prevTime) => Math.max(prevTime - 60, 0));
    }

    function getRemainingHours() {
        return Math.floor(remainingTime / 3600);
    }
    
    function getRemainingMinutes() {
        return Math.floor((remainingTime % 3600) / 60);
    }

    function getRemainingSeconds() {
        return remainingTime % 60;
    }

  function handleInputChange(event) {
    const { name, value } = event.target;
    const parsed = Math.max(0, Number.parseInt(value || '0', 10) || 0);
    let hours = getRemainingHours();
    let minutes = getRemainingMinutes();
    let seconds = getRemainingSeconds();

    if (name === 'hours') {
      hours = parsed;
    } else if (name === 'minutes') {
      minutes = Math.min(parsed, 59);
    } else if (name === 'seconds') {
      seconds = Math.min(parsed, 59);
    }

    const newTime = hours * 3600 + minutes * 60 + seconds;
    setRemainingTime(Math.max(newTime, 0));
    setStartTime(Math.max(newTime, 0));
  }

  function handleReset() {
    setIsRunning(false);
    setRemainingTime(0);
  }

  function formatDigits(value) {
        return String(value).padStart(2, '0');
    }

    return (
        <div className={styles.countdown}>
            <div className={styles.timerContainer}>
                <div id={styles.left} className={styles.smallcontainer}>
                    <div className={styles.timer}> 
                        <input type="text" inputMode='numeric' className={styles.timerInput} name="hours" value={formatDigits(getRemainingHours())} onChange={handleInputChange}/>
                        <span className={styles.colon}>:</span>
                        <input type="text" inputMode='numeric' className={styles.timerInput} name="minutes" min="0" max="59" value={formatDigits(getRemainingMinutes())} onChange={handleInputChange}/>
                        <span className={styles.colon}>:</span>
                        <input type="text" inputMode='numeric' className={styles.timerInput} name="seconds" min="0" max="59" value={formatDigits(getRemainingSeconds())} onChange={handleInputChange}/>
                    </div>
                    <div className={styles.settingsButtons}>
                        <button type="button" className={styles.button} onClick={subtractMinute} aria-label="Trekk fra ett minutt"><Minus /></button>
                        <button type="button" className={styles.button} onClick={addMinute} aria-label="Legg til ett minutt"><Plus /></button>
                    </div>
                </div>
                <div id={styles.right} className={styles.smallcontainer}>

                    <div className={styles.toggleButtons}>
                        <button type="button" className={styles.button} onClick={() => setIsRunning(true)} aria-label="Start nedtelling"><Play /></button>
                        <button type="button" className={styles.button} onClick={() => setIsRunning(false)} aria-label="Pause nedtelling"><Pause /></button>
                        <button type="button" className={styles.button} onClick={handleReset} aria-label="Nullstill nedtelling"><X /></button>
                    </div>

                </div>
            </div>
        </div>
    );

}



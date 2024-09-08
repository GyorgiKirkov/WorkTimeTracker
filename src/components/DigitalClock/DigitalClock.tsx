import React, { useState, useEffect } from 'react';
import styles from './DigitalClock.module.css'; 

const DigitalClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: false   
  });

  const formattedDate = time.toLocaleDateString();

  return (
    <div className={styles.clock}>
      <div className={styles.date}>{formattedDate}</div>
      <div className={styles.time}>{formattedTime}</div>
    </div>
  );
};

export default DigitalClock;

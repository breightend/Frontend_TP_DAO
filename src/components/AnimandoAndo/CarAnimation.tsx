import React from 'react';
import styles from './CarAnimation.module.css';

const CarAnimation: React.FC = () => {
  return (
    // 1. El escenario (reemplaza a HTML)
    <div className={styles.carAnimationContainer}>
      
      {/* 2. El coche y la carretera (reemplaza a BODY) */}
      <div className={styles.carBody}></div>

    </div>
  );
};

export default CarAnimation;
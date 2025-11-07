import React from "react";
import styles from "./CarAnimation.module.css";

const CarAnimation: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-4 left-4 text-2xl animate-bounce">🚗</div>
      <div
        className="absolute top-4 right-4 text-2xl animate-bounce"
        style={{ animationDelay: "0.5s" }}
      >
        🏁
      </div>

      {/* El escenario principal */}
      <div className={styles.carAnimationContainer}>
        {/* El coche y la carretera */}
        <div className={styles.carBody}></div>

        {/* Indicadores de velocidad */}
        <div className="absolute bottom-4 left-4 text-white/70 text-sm font-mono">
          <div className="bg-black/30 rounded-lg px-3 py-2 backdrop-blur-sm">
            <div>Velocidad: 🟢 Activo</div>
            <div>Modo: Automático</div>
          </div>
        </div>

        {/* Indicador de dirección */}
        <div className="absolute bottom-4 right-4 text-white/70 text-sm font-mono">
          <div className="bg-black/30 rounded-lg px-3 py-2 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <span>Ruta:</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarAnimation;

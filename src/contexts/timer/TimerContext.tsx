import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

interface TimerContextType {
  elapsedTime: number;     // en segundos
  formattedTime: string;
  isRunning: boolean;
  startTimer: () => void;
  stopTimer: () => void;
  togglTimer: () => void;
  resetTimer: () => void;
}

interface TimerProviderProps {
  children: React.ReactNode;
  persist?: boolean; // Nueva prop para controlar la persistencia
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<TimerProviderProps> = ({
  children,
  persist = true // Valor por defecto: no persistir
}) => {
  const SESSION_START_KEY = 'sessionStartTime';
  const SESSION_RUNNING_KEY = 'sessionIsRunning';

  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now()); // Referencia para el modo no persistente

  // Cargar el estado inicial
  useEffect(() => {
    if (persist) {
      const savedStartTime = localStorage.getItem(SESSION_START_KEY);
      const savedIsRunning = localStorage.getItem(SESSION_RUNNING_KEY);

      if (savedStartTime) {
        const startTime = parseInt(savedStartTime);
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(elapsed);
      }

      if (savedIsRunning) {
        setIsRunning(savedIsRunning === 'true');
      }
    } else {
      // Modo no persistente: usar referencia en memoria
      startTimeRef.current = Date.now() - elapsedTime * 1000;
    }
  }, [persist]);

  // Manejar el intervalo del temporizador
  useEffect(() => {
    let id: NodeJS.Timeout | null = null;

    if (isRunning) {
      id = setInterval(() => {
        const startTime = persist
          ? parseInt(localStorage.getItem(SESSION_START_KEY) || '0')
          : startTimeRef.current;

        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
      setIntervalId(id);
    }

    return () => {
      if (id) clearInterval(id);
    };
  }, [isRunning, persist]);

  // Funciones del temporizador
  const startTimer = () => {
    const wasPaused = isRunning === false;
    const newStartTime = wasPaused
      ? Date.now() - elapsedTime * 1000
      : Date.now();

    if (persist) {
      localStorage.setItem(SESSION_START_KEY, newStartTime.toString());
      localStorage.setItem(SESSION_RUNNING_KEY, 'true');
    } else {
      startTimeRef.current = newStartTime;
    }

    if (!wasPaused) {
      setElapsedTime(0);
    }

    setIsRunning(true);
  };
  const togglTimer = () => {
    if (isRunning) {
      stopTimer();
    } else {
      startTimer()
    }
  }
  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    if (persist) {
      localStorage.setItem(SESSION_RUNNING_KEY, 'false');
    }

    setIsRunning(false);
  };

  const resetTimer = () => {
    const now = Date.now();

    if (persist) {
      localStorage.setItem(SESSION_START_KEY, now.toString());
      localStorage.setItem(SESSION_RUNNING_KEY, 'true');
    } else {
      startTimeRef.current = now;
    }

    setIsRunning(true);
    setElapsedTime(0);
  };

  // Formatear tiempo como HH:MM:SS
  function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }


  const formattedTime = formatTime(elapsedTime);

  return (
    <TimerContext.Provider value={{
      elapsedTime,
      togglTimer,
      formattedTime,
      isRunning,
      startTimer,
      stopTimer,
      resetTimer
    }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer debe usarse dentro de un TimerProvider');
  }
  return context;
};
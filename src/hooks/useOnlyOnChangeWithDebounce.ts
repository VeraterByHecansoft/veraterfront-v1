import { useEffect, useRef } from 'react';

/**
 * Ejecuta una función solo cuando el valor cambia realmente.
 * Tiene un debounce opcional y accede siempre a las variables más recientes.
 */
export function useOnlyOnChangeWithDebounce<T>(
  callback: () => void,
  value: T,
  delay: number = 300
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevValueRef = useRef<T | null>(null);
  const callbackRef = useRef<() => void>(() => {});

  // Mantener siempre el último callback disponible
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const serializedCurrent = JSON.stringify(value);
    const serializedPrev = JSON.stringify(prevValueRef.current);

    if (serializedCurrent !== serializedPrev) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(); // Ejecutar el callback actualizado
        prevValueRef.current = value;
      }, delay);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value]);
}
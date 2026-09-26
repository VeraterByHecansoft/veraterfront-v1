import {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef
} from 'react';

import { useDispatch } from 'react-redux';
import { sendRequest, SocketReqType } from '@/contexts/socket/sendRequest';
import { setOnlineStatus, setWssEventMessage } from '../store/slicers/authSlice';
import { messageProcesor } from '@/contexts/socket/messageProcesor';
import { AppDispatch } from '@/contexts/store';
import { safeJsonParse } from '@/utils/JSON';

type SocketType = WebSocket | null;

const MAX_RETRIES = 20;
const RECONNECT_DELAY_MS = 1000;

interface ISocketContext {
  socket: SocketType;
  error?: string | undefined;
  sendSocketRequest: (req: SocketReqType) => void;
}

export const SocketContext = createContext<ISocketContext>({
  socket: null,
  error: undefined,
  sendSocketRequest: () => { },
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const _socket = useRef<SocketType>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const retryCount = useRef(0);
  const dispatch = useDispatch<AppDispatch>();

  // Conectar al servidor WebSocket
  const connectSocket = useCallback(() => {
    if (_socket.current && (_socket.current.readyState === WebSocket.OPEN || _socket.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);
      ws.onopen = () => {
        _socket.current = ws
        retryCount.current = 0
        dispatch(setOnlineStatus(true));
        setError(undefined);
      };

      ws.onmessage = (event) => {
        try {
          let raw = event?.data || event;
          let data = typeof raw === 'string' ? safeJsonParse(raw) : raw;

          if (!data)
            return console.warn('invalid Response');
          dispatch(setWssEventMessage(data))
        } catch (error) {
          console.error('Error', error);
        }

      };

      ws.onerror = (err: any) => {
        console.error('[WS] Error en conexión:', err?.message);
        setError('WebSocket Error: ' + (err as any).message || 'Desconocido');
        ws.close();
      };

      ws.onclose = (event) => {
        dispatch(setOnlineStatus(false));
        if (retryCount.current < MAX_RETRIES) {
          const delay = Math.min(RECONNECT_DELAY_MS * Math.pow(2, retryCount.current), 30000); // Hasta 30 segundos
          setTimeout(() => {
            retryCount.current = +1
            connectSocket(); // Reintentar conexión
          }, delay);
        } else {
          console.warn('[WS] Máximos reintentos alcanzados');
          setError('No se pudo conectar al servidor WebSocket después de varios intentos');
        }
      };

      return () => {
        ws.close();
      };
    } catch (err) {
      console.error('[WS] Error al crear conexión:', err);
      setError('Error al inicializar WebSocket: ' + (err as any).message);
    }
  }, [retryCount]);

  // Iniciar conexión cuando el componente monte
  useEffect(() => {
    connectSocket();
    return () => {
      if (_socket.current && _socket.current.readyState === WebSocket.OPEN) {
        _socket.current.close();
      }
    };
  }, []);

  // Enviar mensajes por defecto
  const sendSocketRequest = (req: SocketReqType) => {
    if (_socket.current && _socket.current.readyState === WebSocket.OPEN) {
      sendRequest(req, _socket.current)
    } else {
      console.warn('[WS] No se puede enviar mensaje - conexión no establecida', _socket?.current?.readyState);
    }
  };

  return (
    <SocketContext.Provider value={{ socket: _socket.current, error, sendSocketRequest }}>
      {children}
    </SocketContext.Provider>
  );
};
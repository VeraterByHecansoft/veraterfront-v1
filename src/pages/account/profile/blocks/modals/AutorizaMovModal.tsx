import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

import { useAPIContext } from '@/auth/useAPIContext';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/contexts/store';
import { toAbsoluteUrl } from '@/utils';
import { Button } from '@mui/base';
import { useGeolocation } from '@/hooks';
import { useSocket } from '@/contexts/socket/SocketProvider';
import { setWssEventMessage } from '@/contexts/store/slicers/authSlice';
import { operationResult, operationStatus, TokenResponse } from '@rute/types';

interface IModalProfileProps {
  title?: string;
  description?: string;
  onCancel?: () => void,
  onResult?: (result: any) => void,
  data?: any,
  open: boolean
}

const AutorizaMovModal = ({ open, onCancel, onResult, data, title, description }: IModalProfileProps) => {
  const { post } = useAPIContext();
  const dispatch = useDispatch<AppDispatch>();
  const [tokenCode, setTokenCode] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<operationStatus>('idle');
  const [error, setError] = useState<string | undefined>(undefined);
  const [result, setResult] = useState<operationResult | undefined>(undefined);
  const [remainingTime, setRemainingTime] = useState<number>(120);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const expirationTime = useRef<number>(120);
  const { sendSocketRequest } = useSocket()
  const { wssEventMessage } = useSelector((state: RootState) => state.auth);
  const {
    error: error_coords,
    permission: permission_coords,
    requestLocation,
  } = useGeolocation()

  const setExpirationTime = (time: number) => {
    expirationTime.current = time
    setRemainingTime(time)
  }

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Limpiar el timer al desmontar el componente
  useEffect(() => {
    return () => stopTimer();
  }, []);

  useEffect(() => {
    if (wssEventMessage) {
      const event = { ...wssEventMessage }
      const e = event?.e;
      const status = event?.status;
      const message = event?.message;
      setResult(event)
      setStatus(status);
      if (status === 'succeeded' && e === 'TRASFIEREAUT') {
        setTimeout(() => {
          onResult?.({ ...event, event: 'succeeded' })
        }, 2000);
      } else if (status === 'failed' && e === 'TRASFIEREAUT') {
        setError(message);
      }
      dispatch(setWssEventMessage(undefined))
    }
  }, [wssEventMessage])

  const startTimer = () => {
    // Calcular tiempo restante en segundos
    const calculateRemainingTime = () => {
      const diferencia = expirationTime.current - 1;
      return diferencia
    };

    // Limpiar timer existente
    stopTimer();

    // Iniciar con el tiempo actual
    setExpirationTime(calculateRemainingTime());

    // Iniciar nuevo timer
    timerRef.current = setInterval(() => {
      const time = calculateRemainingTime();
      setExpirationTime(time);
      if (time <= 0) {
        stopTimer();
        getTokenCode(); // Renovar token al expirar
      }
    }, 1000);
  };

  const getTokenCode = () => {
    setStatus('pending');
    setError(undefined);
    setTokenCode(undefined);
    const iddoc = data.iddoc;
    post('/token/solauttransfer', {
      iddoc: iddoc,
      coords: {}
    }).then((response: any) => {
      const data: TokenResponse = response.data
      if (data.code) {
        const expirationTime = data.expire - data.timeStamp;
        const segundos = expirationTime / 1000
        const now = Date.now();
        if (data.expire >= now) {
          getTokenCode();
          return;
        }
        sendSocketRequest({ type: 'token.auth', params: {} });
        setTokenCode(data.code);
        setExpirationTime(segundos)
        setStatus('active');
        startTimer();
      } else {
        stopTimer();
        setStatus('failed');
        setError('Error al solicitar el token');
        setExpirationTime(120);
        setTokenCode(undefined);
        setResult(undefined);
      }
    }).catch((error) => {
      stopTimer();
      setStatus('failed');
      setError('Error al solicitar el token');
      setExpirationTime(120);
      setTokenCode(undefined);
      setResult(undefined);
    });
  };

  // Formatear el tiempo para mostrar MM:SS
  const formatTimeDisplay = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Detener manualmente
  const handleCancel = () => {
    stopTimer();
    setStatus('idle');
    setExpirationTime(120);
    setTokenCode(undefined);
    setResult(undefined);
    onCancel?.();
  };

  useEffect(() => {
    if (open) {
      if (`${permission_coords}` === 'granted') {
        requestLocation()
        getTokenCode()
      } else {
        alert('Por regulaciones de STP y Banxico, debes habilitar la geolocalización para solicitar tu Token.');
        stopTimer();
        setStatus('idle');
        setExpirationTime(120);
        setTokenCode(undefined);
        setResult(undefined);
      }
    } else {
      stopTimer();
      setStatus('idle');
      setExpirationTime(120);
      setTokenCode(undefined);
      setResult(undefined);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-[500px] p-8 overflow-hidden">
        <DialogHeader className="p-0 border-0">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogBody className="py-0">
          <div className="flex flex-col items-stretch grow gap-5">
            <div className="flex flex-col items-center pt-6 pb-4 space-y-4">
              {/* Estado: Cargando */}
              {status === 'pending' && !tokenCode && !result && (
                <div className="w-full flex flex-col items-center gap-3">
                  <p className="text-muted-foreground text-sm">Solicitando token de autorización…</p>
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {/* Estado: Token activo */}
              {tokenCode && status === 'active' && (
                <>
                  <p className="text-lg font-semibold">
                    Tiempo restante: {(formatTimeDisplay(remainingTime))}
                  </p>
                  <img
                    src={tokenCode}
                    alt="Código de token"
                    className="w-48 h-48 object-contain rounded-lg shadow-md border"
                  />
                  <p className="text-muted-foreground text-sm text-center">
                    Utiliza este código para autorizar la trasferencia
                  </p>
                </>
              )}

              {/* Estado: Autorización exitosa */}
              {status === 'succeeded' && result && (
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={toAbsoluteUrl('/media/illustrations/success.svg')}
                    alt="Éxito"
                    className="w-24 h-24 object-contain"
                  />
                  <p className="text-green-600 text-center">{result.message}</p>
                </div>
              )}

              {/* Estado: Error */}
              {status === 'failed' && (
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={toAbsoluteUrl('/media/illustrations/warning-dark.svg')}
                    alt="Error"
                    className="w-24 h-24 object-contain"
                  />
                  <p className="text-red-500 text-center">
                    {error || 'Error al procesar la solicitud'}
                  </p>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4 mt-6">
              {result && status === 'succeeded' && (
                <Button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition" onClick={handleCancel}>
                  aceptar
                </Button>
              )}

              {(status === 'active' || status === 'failed') && (
                <Button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition" onClick={handleCancel}>
                  Cancelar
                </Button>
              )}
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { AutorizaMovModal };
import { useAuthContext } from '@/auth';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { AppDispatch, RootState } from '@/contexts/store';
import { setSessionTimeOut } from '@/contexts/store/slicers/authSlice';
import { toAbsoluteUrl } from '@/utils';
import { formatTime } from '@/utils/Timing';
import { Button } from '@mui/base';
import useTimeout from '@mui/utils/useTimeout';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

interface ModalSessionFinishedMessageProps {
}

const ModalSessionFinishedMessage = ({ }: ModalSessionFinishedMessageProps) => {
  const maxTime = 60;
  const { logout, verify } = useAuthContext();
  const [open, setOpen] = useState(false);
  const MAX_TIME_SESSION = import.meta.env.VITE_MAX_TIME_SESSION
  const [timeout, setTimeout] = useState(maxTime);

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now()); // Referencia para el modo no persistente
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();
  const { sessionTimeOut } = useSelector((state: RootState) => state.auth);

  const handlerLogout = () => {
    setOpen(false);
    logout();
  }

  const handlerAceptar = () => {
    verify().then(() => {
      dispatch(setSessionTimeOut(0))
      setTimeout(maxTime)
    }).catch(err => {
      alert(err.message)
    })
    setOpen(false);

    dispatch(setSessionTimeOut(0))
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }

  const startTimer = () => {
    if (!intervalId) {
      startTimeRef.current = Date.now();
      let id: NodeJS.Timeout | null = null;
      id = setInterval(() => {
        const startTime = startTimeRef.current;
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setTimeout(maxTime - elapsed)
        setElapsedTime(elapsed);
      }, 1000);
      setIntervalId(id);
    }
  }

  useEffect(() => {
    if (sessionTimeOut && sessionTimeOut > MAX_TIME_SESSION) {
      console.log('ups01',{timeout, maxTime, sessionTimeOut,MAX_TIME_SESSION})
      startTimer()
      setOpen(true);
    }

  }, [sessionTimeOut])

  useEffect(() => {
    if (timeout < maxTime && sessionTimeOut > MAX_TIME_SESSION) {
      console.log('ups02',{timeout, maxTime, sessionTimeOut,MAX_TIME_SESSION})
      setOpen(false);
      logout();
    }
  }, [timeout])

  return (
    <Dialog open={open} onOpenChange={handlerAceptar}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader className="border-0">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DialogBody className="flex flex-col items-center pt-10 pb-10">
          <div className="mb-10">
            <img
              src={toAbsoluteUrl('/media/illustrations/12.svg')}
              className="dark:hidden max-h-[140px]"
            />
            <img
              src={toAbsoluteUrl('/media/illustrations/12.svg')}
              className="light:hidden max-h-[140px]"
            />
          </div>
          {`sessionTimeOut ${sessionTimeOut}`}
          <h3 className="text-lg font-medium text-gray-900 text-center mb-3">
            Tu sesión a finalizado por inactividad.
          </h3>
          <small>Tiempo sin actividad:{formatTime(elapsedTime)}</small>
          <div className="text-2sm text-center text-gray-700 mb-7">
            Por motivos de seguridad, hemos finalizado tu sesión automáticamente
            después de detectar {MAX_TIME_SESSION} minutos de inactividad. Para continuar,
            por favor inicia sesión nuevamente.
          </div>
          <div className='flex content-between gap-4'>
            <Button onClick={handlerAceptar} className=" btn  btn-info text-2sm  font-medium  py-3">
              Continuar {timeout}
            </Button>
            <Button onClick={handlerLogout} className=" btn  btn-danger text-2sm  font-medium  py-3">
              Salir
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { ModalSessionFinishedMessage };

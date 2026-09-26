import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAPIContext } from '@/auth/useAPIContext';
import { IstpData } from '../cuentas';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/contexts/store';
import { operationResult, operationStatus, TokenResponse } from '@rute/types';
import { useSocket } from '@/contexts/socket/SocketProvider';
import { Button } from '@mui/base';
import { formatTimeDisplay } from '@/utils/Timing';
import { toAbsoluteUrl } from '@/utils';
import { setWssEventMessage } from '@/contexts/store/slicers/authSlice';

interface IModalProps {
  open: boolean;
  onOpenChange: (refr: boolean) => void;
  account?: IstpData
}

const SaldoVirtualModal = ({ open, onOpenChange, account }: IModalProps) => {
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
  const { wssEventMessage, setUseridt } = useSelector((state: RootState) => state.auth);
  const [transaccion, setTransaccion] = useState<any>(undefined)

  const [nota, setNota] = useState(''); //A
  const [monto, setMonto] = useState(''); //A
  const [cuentaInv, setCuentaInv] = useState('646180632000000697'); //A

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
        getTokenCode(transaccion); // Renovar token al expirar
      }
    }, 1000);
  };

  const [formData, setFormData] = useState<IstpData>({
    CLABE: "",
    estado: "",
    tipo: "",
    EMP: "",
    maestra: "",
    propietario: "",
    HOST: "",
    GRUPO: "",
    saldoret: "",
    saldo: "",
    saldoant: "",
    saldoCorte: "",
    lstu: "",
    divisa: "",
    usrstp: "",
    esSTP: "",
    plan: "",
    LMTSAL: "",
    LMTMOV: "",
    LMTrasSTP: "",
    entrada: 0,
    salida: 0,
    itnombre: "",
    falta: "",
    fcancela: "",
    fbloq: "",
    freact: "",
    rtstatus: "",
  });

  const handleTrasfiere = () => {
    const params = {
      TIPO: 'CLABE',
      BANCO: "STP",
      CLABE: account?.CLABE,
      CLABEOrg: cuentaInv,
      nombreReceptor: `${account?.itnombre}`,
      nombreEmisor: "EMP",
      concepto: nota,
      importe: monto,
      referencia: '1234'
    }
    getTokenCode(params)
  }

  const getTokenCode = (transaccion: any) => {
    setStatus('pending');
    setError(undefined);
    setTokenCode(undefined);
    setTransaccion(transaccion);

    post('/token/traspasovtl', transaccion).then((response: any) => {
      const data: TokenResponse = response.data
      if (data.code) {
        const expirationTime = data.expire - data.timeStamp;
        const segundos = expirationTime / 1000
        const now = Date.now();

        if (data.expire >= now) {
          getTokenCode(transaccion);
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

  const handleCancel = () => {
    stopTimer();
    setStatus('idle');
    setExpirationTime(120);
    setTokenCode(undefined);
    setResult(undefined);
    setTransaccion(undefined);
  };

  useEffect(() => {
    if (account) {
      setFormData(prev => ({
        ...prev,
        ...account,
      }));
    }
  }, [account]);

  useEffect(() => {
    if (wssEventMessage) {
      console.log({wssEventMessage})
      const event = { ...wssEventMessage }
      const e = event?.e;
      const status = event?.status;
      const message = event?.message;
      setResult(event)
      if (status === 'succeeded' && e === 'TRASFIEREAUT') {
        setTimeout(() => {
          onOpenChange?.(true)
        }, 2000);

      } else if (status === 'failed' && e === 'TRASFIEREAUT') {
        setError(message);
      }
      dispatch(setWssEventMessage(undefined))
    }
  }, [wssEventMessage]);

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(false)}>
      <DialogContent className="max-w-[600px] p-4 rounded-lg">
        <DialogHeader className="p-0 border-0">
          <DialogTitle>Saldo Virtual</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mb-4 text-sm text-gray-600">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="font-medium">CLABE:</span>
              <span>{formData.CLABE || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Saldo Actual:</span>
              <span>{formData.saldo || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Saldo Retenido:</span>
              <span>{formData.saldoret || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Saldo Virtual:</span>
              <span>{formData.Min_Ret || "—"}</span>
            </div>
          </div>
        </DialogDescription>

        {/* Formulario */}
        <DialogBody className="max-h-[400px] overflow-y-auto space-y-3">
          {transaccion ? <div className="flex flex-col items-stretch grow gap-5">
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

          </div> :
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-sm font-medium">Cuenta de inversiones.</label>
                <select name='cuentaInv' className="border rounded-md p-2"
                  value={cuentaInv} onChange={(e) => { setCuentaInv(e.target.value) }} >
                  <option value='646180632000000697'>646180632000000697(Cuenta de Inversiones)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-sm font-medium">Monto a Otorgar</label>
                <input
                  name='monto'
                  type='number'
                  className="border rounded-md p-2"
                  value={monto}
                  onChange={(e) => { setMonto(e.target.value) }} />
              </div>
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-sm font-medium">Concepto</label>
                <input
                  name='itnombre'
                  className="border rounded-md p-2"
                  value={nota}
                  onChange={(e) => { setNota(e.target.value) }} />
              </div>

              {/* ... más campos según lo que necesites */}
            </div>}
        </DialogBody>

        {/* Botones */}
        <div className="flex justify-end gap-4 mt-6">
          {!result && status === 'idle' && (
            <Button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition" onClick={handleTrasfiere}>
              Transferir
            </Button>
          )}
          {result && status === 'succeeded' && (
            <Button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition" onClick={handleCancel}>
              Aceptar
            </Button>
          )}

          {(status === 'active' || status === 'failed') && (
            <Button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition" onClick={handleCancel}>
              Cancelar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { SaldoVirtualModal };

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAPIContext } from '@/auth/useAPIContext';
import { IstpData } from '../cuentas';
import { formatearMonedaMXN } from '@/utils/Money';
import { SelectorCLABERT } from '@/components/rute/SelectorCLABERT';
import { operationResult, operationStatus, TokenResponse } from '@rute/types';
import { Button } from '@mui/base';
import { RootState } from '@/contexts/store';
import { useSelector } from 'react-redux';
import { useSocket } from '@/contexts/socket/SocketProvider';

interface IModalProps {
  open: boolean;
  onOpenChange: (refr: boolean) => void;
  account?: IstpData,
  clabes: any[]
}

const TrasfiereCuentasModal = ({ open, onOpenChange, account, clabes }: IModalProps) => {
  const { post } = useAPIContext();
  const divReff = useRef<any | null>(null);
  const _referencia = useRef<HTMLInputElement>(null);
  var randomNum = Math.floor(100000 + Math.random() * 900000);

  const [isMaster, setIsmaster] = useState(account?.maestra === "1")
  const [isbloqueada, setIsbloqueada] = useState(false)
  const [estado, setEstado] = useState(account?.estado || "")
  const [entrada, setEntrada] = useState<string>(`${formatearMonedaMXN(0)}`);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | undefined>(undefined);
  const [retMd, setRetMd] = useState('B'); //A
  const [nota, setNota] = useState(''); //A
  const [monto, setMonto] = useState(''); //A
  const [cuentaInv, setCuentaInv] = useState('646180632000000697'); //A
  const [status, setStatus] = useState<operationStatus>('idle');
  const [message, setMessage] = useState(''); //A



  const [tokenCode, setTokenCode] = useState<string | undefined>(undefined);

  const [error, setError] = useState<string | undefined>(undefined);
  const [result, setResult] = useState<operationResult | undefined>(undefined);
  const [remainingTime, setRemainingTime] = useState<number>(120);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const expirationTime = useRef<number>(120);
  const { sendSocketRequest } = useSocket()
  const { wssEventMessage } = useSelector((state: RootState) => state.auth);
  const [transaccion, setTransaccion] = useState<any>(undefined)

  const handdleSelect = (cuenta: any) => {
    setSelected(cuenta)
  }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };



  useEffect(() => {
    if (account) {
      if (account.Md) {
        setRetMd('A')
      }
      setFormData(prev => ({
        ...prev,
        ...account,
      }));
    }
  }, [account]);

  useEffect(() => {
    if (formData) {
      if (formData.Md) {
        setRetMd('A')
      }

      if (parseInt(formData.maestra || '1') == 1) {
        setIsmaster(true)
        setFormData(prev => ({
          ...prev,
          salida: -1,
          entrada: -1
        }));
      } else {
        setIsmaster(false)
      }

    }
  }, [formData]);

  const handleTrasfiere = () => {
    const params = {
      TIPO: 'CLABE',
      BANCO: "STP",
      CLABE: account?.CLABE,
      nombreReceptor: `${account?.itnombre}`,
      nombreEmisor: formData?.propietario,
      concepto: nota,
      importe: monto,
      referencia: '1234'
    }
    getTokenCode(params)
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

  const getTokenCode = (transaccion: any) => {
    setStatus('pending');
    setError(undefined);
    setTokenCode(undefined);
    setTransaccion(transaccion);

    post('/token/solauttransfer', transaccion).then((response: any) => {
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


  // Detener manualmente
  const handleCancel = () => {
    stopTimer();
    setStatus('idle');
    setExpirationTime(120);
    setTokenCode(undefined);
    setResult(undefined);
    setTransaccion(undefined);
  };

  useEffect(() => {
    if (formData) {
      const MONTO = parseFloat(monto) || 0
      const DISPONIBLE = parseFloat(formData.saldo || `0`) || 0
      if (MONTO > DISPONIBLE) {
        setStatus('failed');
        setMessage(`El monto a ingresar es mayor al saldo virtual disponible ${MONTO} >${DISPONIBLE}`)
      } else {
        setStatus('idle')
      }
    }
  }, [monto]);

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(false)}>
      <DialogContent className="max-w-[600px] p-4 rounded-lg">
        <DialogHeader className="p-0 border-0">
          <DialogTitle>Configurar Cuenta RT</DialogTitle>
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
            <div className="flex justify-between">
              <span className="font-medium">{message}</span>
            </div>
          </div>
        </DialogDescription>

        {/* Formulario */}
        <DialogBody className="max-h-[400px] overflow-y-auto space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 col-span-2">
              <div className="flex-1 flex flex-col relative" id="selectorcuentas" ref={divReff}>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Cuenta Destino
                </label>
                <SelectorCLABERT
                  dropdownRef={divReff}
                  items={clabes}
                  selected={selected}
                  onSelect={handdleSelect}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-sm font-medium">Monto</label>
              <input
                name='monto'
                type='number'
                className="border rounded-md p-2"
                value={monto}
                onChange={(e) => { setMonto(e.target.value) }} />
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-sm font-medium">Referencia</label>
              <input
                ref={_referencia}
                name='itnombre'
                className="border rounded-md p-2"
                value={randomNum}
                //onChange={(e) => { setNota(e.target.value) }} 
                 
                 
                />
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-sm font-medium">Concepto</label>
              <input
                name='itnombre'
                className="border rounded-md p-2"
                value={nota}
                maxLength={40}
                onFocus={(e) => {
                    randomNum = Math.floor(100000 + Math.random() * 900000);
                    if (_referencia.current) {
                      _referencia.current.value = randomNum.toString();
                    }
                }} 
                onChange={(e) => {
                   const regex = /[^a-zA-Z0-9\s]/g;
    
                   const valorLimpio = e.target.value.replace(regex, '').slice(0, 40);
                    setNota(valorLimpio) 
                  //setNota(e.target.value)  
                  }} />
            </div> 
          </div>
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

export { TrasfiereCuentasModal };

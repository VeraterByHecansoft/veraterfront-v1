import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAPIContext } from '@/auth/useAPIContext';
import { IstpData } from '../cuentas';
import { formatearMonedaMXN } from '@/utils/Money';

interface IModalProps {
  open: boolean;
  onOpenChange: (refr: boolean) => void;
  account?: IstpData
}

const ConfModal = ({ open, onOpenChange, account }: IModalProps) => {
  const { put } = useAPIContext();
  const parentRef = useRef<any | null>(null);
  const [isMaster, setIsmaster] = useState(account?.maestra === "1")
  const [isbloqueada, setIsbloqueada] = useState(false)
  const [estado, setEstado] = useState(account?.estado || "")
  const [entrada, setEntrada] = useState<string>(`${formatearMonedaMXN(0)}`);
  const [loading, setLoading] = useState(true);

  const onBloquearIngresosChange = (state: boolean) => {
    if (!isMaster)
      setIsbloqueada(state)
  }

  const onEstadoChange = (value: string) => {
    setEstado(value)
  }

  const update = () => {
    if (account) {
      const params = {
        CLABE: account.CLABE,
        maestra: isMaster,
        entrada: isbloqueada ? 0 : 24999.00,
        estado:estado
      }
      put(`/stp/conf`, params).then((response: any) => {
        toast.info('Guardado');
        onOpenChange?.(true)
      })
        .catch((err) => {
          toast.error(err.message || '[STP] Error al cargar la conciliación')
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  useEffect(() => {
    if (account) {
      setIsmaster(account?.maestra === "1")
      if (account.entrada == 0) {
        setIsbloqueada(true);
        setEntrada(`${formatearMonedaMXN(0)}`)
      } else {
        setIsbloqueada(false);
        setEntrada(`${formatearMonedaMXN(24999.00)}`)
      }
    }
  }, [account]);

  return (
    <Dialog open={open} onOpenChange={() => { onOpenChange(false) }}>
      <DialogContent className="container-fixed max-w-[300px] p-2 overflow-hidden">
        <DialogHeader className="p-0 border-0">
          <DialogTitle>Configurar Cuenta</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mb-2">
        </DialogDescription>
        <DialogBody className="scrollable-y py-0 mb-5 ps-0 pe-3 -me-7" ref={parentRef}>
          <div className="flex grow gap-1">
            <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl shadow-md">

              {/* GRID en filas */}
              <div className="flex flex-col gap-4 p-4">
                {/* CLABE */}
                <div>
                  <label className="text-sm text-gray-500">CLABE: {account?.CLABE}</label>
                </div>

                {/* Maestra */}
                <div>
                  <label className="text-sm text-gray-500">Maestra</label>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input type="radio" checked={isMaster} disabled />
                      <span>Sí</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input type="radio" checked={!isMaster} disabled />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                {/* Bloquear ingresos (ocupa toda la fila) */}
                <div className="flex flex-col col-span-1 md:col-span-2 lg:col-span-3">
                  <label className="text-sm text-gray-500 mb-1">
                    Bloquear ingresos
                    <label className="inline-flex items-center gap-2 text-sm p-2">
                      <input
                        type="checkbox"
                        checked={isbloqueada}
                        disabled={isMaster}
                        onChange={(e) => onBloquearIngresosChange?.(e.target.checked)}
                      />
                    </label>
                  </label>
                  {!isbloqueada && <label className="text-sm text-gray-500 mb-1">
                    <input
                      type="string"
                      value={entrada}
                      disabled={true}
                    />
                  </label>}
                </div>

                {/* Estado */}
                <div>
                  <label className="text-sm text-gray-500">Estado</label>
                  <select
                    value={estado}
                    disabled={isMaster}
                    onChange={(e) => onEstadoChange?.(e.target.value)}
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isMaster ? 'bg-gray-50 text-gray-700' : ''}`}
                  >
                    <option value="A">Activa</option>
                    <option value="I">Inactiva</option>
                    <option value="B">Bloqueada</option>
                  </select>
                </div>

                {/* Usuario */}
                <div>
                  <label className="text-sm text-gray-500">Usuario</label>
                  <input
                    type="text"
                    value={account?.itnombre}
                    disabled
                    className="w-full p-2 border rounded-md bg-gray-50 text-gray-700"
                  />
                </div>

                {/* Divisa */}
                <div>
                  <label className="text-sm text-gray-500">Divisa</label>
                  <input
                    type="text"
                    value={account?.divisa}
                    disabled
                    className="w-full p-2 border rounded-md bg-gray-50 text-gray-700"
                  />
                </div>

   <div onClick={() => { update() }}
                  className={`btn btn-light btn-sm flex items-center gap-2 px-3 py-1 rounded-lg font-semibold bg-yellow-100 text-yellow-800`}
                >
                  ⚠️ Guardar
                </div>
              </div>
              
             
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { ConfModal };

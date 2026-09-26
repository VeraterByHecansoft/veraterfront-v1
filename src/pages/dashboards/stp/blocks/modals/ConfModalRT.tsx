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

const ConfModalRT = ({ open, onOpenChange, account }: IModalProps) => {
  const { put } = useAPIContext();
  const parentRef = useRef<any | null>(null);
  const [isMaster, setIsmaster] = useState(account?.maestra === "1")
  const [isbloqueada, setIsbloqueada] = useState(false)
  const [estado, setEstado] = useState(account?.estado || "")
  const [entrada, setEntrada] = useState<string>(`${formatearMonedaMXN(0)}`);
  const [loading, setLoading] = useState(true);

  const [retMd, setRetMd] = useState('B'); //A
  const [CLABEMd, setCLABEMd] = useState(''); //A
  const [CLABENom, setCLABENom] = useState(''); //A

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
        entrada: isbloqueada ? -1 : 24999.00,
        estado: estado
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

  const handleSave = () => {

  };

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
              <span className="font-medium">Min_Ret:</span>
              <span>{formData.Min_Ret || "—"}</span>
            </div>
          </div>
        </DialogDescription>

        {/* Formulario */}
        <DialogBody className="max-h-[400px] overflow-y-auto space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Estado</label>
              <select name='estado' className="border rounded-md p-2"
                value={estado} onChange={handleChange}>
                <option value='A'>Activo</option>
                <option value='B'>Inactivo</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Es Maestra</label>
              <select name='maestra' className="border rounded-md p-2"
                value={isMaster ? 1 : 0} onChange={handleChange}>
                <option value='1'>Si</option>
                <option value='0'>No</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Tipo</label>
              <select name='tipo' className="border rounded-md p-2"
                value={formData.tipo} onChange={handleChange}>
                <option value='G'>Generla</option>
                <option value='N'>Nomina</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Retener Saldo con Midelware</label>
              <select
                className="border rounded-md p-2"
                value={retMd}
                onChange={(e) => { setRetMd(e.target.value) }}>
                <option value='A'>Activado</option>
                <option value='B'>Bloqueado</option>
              </select>
            </div>
            {formData.tipo == 'N' &&
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-sm font-medium">CLABE (Nomina)</label>
                <input
                  name='CLABENom'
                  className="border rounded-md p-2"
                  value={CLABENom}
                  onChange={(e) => { setCLABENom(e.target.value) }} />
              </div>
            }
            {retMd == 'A' && <div className="flex flex-col gap-1 col-span-2 rounded-sm bg-background-white shadow-lg">
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-sm font-medium">CLABE (Midelware)</label>
                <input
                  name='itnombre'
                  className="border rounded-md p-2"
                  value={CLABEMd}
                  onChange={(e) => { setCLABEMd(e.target.value) }} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Porsentaje</label>
                <input
                  name='Por_Apart'
                  className="border rounded-md p-2"
                  value={formData.Por_Apart}
                  onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Fijo</label>
                <input
                  name='Fij_Apart'
                  className="border rounded-md p-2"
                  value={formData.Fij_Apart}
                  onChange={handleChange} />
              </div>
            </div>
            }
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Entrada</label>
              <input
                name='entrada'
                readOnly={isMaster}
                className="border rounded-md p-2"
                value={formData.entrada}
                onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Salida</label>
              <input
                name='salida'
                readOnly={isMaster}
                className="border rounded-md p-2"
                value={formData.salida}
                onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-sm font-medium">Nota</label>
              <input
                name='itnombre'
                className="border rounded-md p-2"
                value={formData.itnombre}
                onChange={handleChange} />
            </div>

            {/* ... más campos según lo que necesites */}
          </div>
        </DialogBody>

        {/* Botones */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ConfModalRT };

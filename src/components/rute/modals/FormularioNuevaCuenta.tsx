
import { useAPIContext } from "@/auth/useAPIContext";
import { TBancoItem, TIconRecept, TTransferRecept, TTypeRecept } from "@rute/types";
import Reac, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { SelectorBancos } from "../SelectorBancos";
import { HandCoins } from "lucide-react";
import { Button } from "@mui/base";
export type TBANCO = {
  clave: string;
  nombre: string;
  descripcion: string;
}
interface FormularioNuevaCuentaProps {
    onGuardar: (cuenta: TTransferRecept) => void;
    onCancelar: () => void;
    selected?: TTransferRecept,
    items: TTransferRecept[],
    isEditing:boolean,
    setIsEditing:React.Dispatch<React.SetStateAction<boolean>>
}
// Componente para añadir nueva cuenta
export const FormularioNuevaCuenta = ({
  onGuardar,
  onCancelar,
  isEditing,
  setIsEditing,
  selected,
  items

}: FormularioNuevaCuentaProps) => {  
   
  const { post, get } = useAPIContext()
  const [CLABE, setCLABE] = useState('');
  const [opcsBancos, setOpcsBancos] = useState<Array<TBancoItem>>([])
  const [nombreBeneficiario, setNombreBeneficiario] = useState("")
  const [tipo, setTipo] = useState<TTypeRecept | undefined>(undefined);
  const [icon, setIcon] = useState<TIconRecept | undefined>(undefined);
  const [showBancos, setShowBancos] = useState(false);
  const [selectedBanco, setSelectedBanco] = useState<TBancoItem | undefined>(undefined);

  // Referencia para el dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);
  const refNombre = useRef<HTMLInputElement>(null);
  const refClabe = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    get('/bancos').then((response: any) => {
      const data = response.data;
      const bar = data.map((banco: any) => {
        return {
          ...banco,
          value: banco.clave,
          text: banco.nombre
        }
      });
      setOpcsBancos(bar);
    }).catch((err)=>{})
  }, []);

  const handdleSelectBanco = (banco: TBancoItem) => {
    setSelectedBanco(banco)
  }
  const handleArchive = () => {
  
    const _tipo = selected?.CLABE.length == 18 ? 40 : selected?.CLABE.length == 16 ? 3 : selected?.CLABE.length == 10 ? 10 : 0;

    const confirmacion = window.confirm("¿Estás seguro de que deseas archivar esta cuenta?");
     if (!confirmacion) {
      return;
    }
    const params = {
      BANCO:selected?.BANCO,
      CLABE: selected?.CLABE,
      RFCCURP: `NA`,
      nombre: selected?.nombre,
      tipo: _tipo,
      vspart:selected?.vspart
    }
    post(`/archivar`, params).then((response: any) => {
      const data = response.data as TTransferRecept
      onCancelar()
    }).catch(() => {

    })

  }
  const handleSave = () => {
    const _tipo = CLABE.length == 18 ? 40 : CLABE.length == 16 ? 3 : CLABE.length == 10 ? 10 : false;
    if (nombreBeneficiario?.length <= 0) {
      toast.error('Ingrese el nombre de la cuenta');
      refNombre?.current?.focus()
      return;
    }
    if (!_tipo) {
      toast.error('La cuenta no es valida');
      refClabe?.current?.focus()
      return;
    }
    const params = {
      BANCO: selectedBanco?.value,
      CLABE: CLABE,
      RFCCURP: `NA`,
      nombre: nombreBeneficiario,
      tipo: tipo,
      vspart: selectedBanco?.vspart
    } 
    post(`/contact`, params).then((response: any) => {
      const data = response.data as TTransferRecept
      onGuardar(data)
    }).catch(() => {

    })
  }

  const getBanco = (clabe: string) => {
    const clave = clabe.slice(0, 3);
    if (opcsBancos) {
      const BANCO = opcsBancos.filter(b => b.clave === clave);
      if (BANCO[0]) return BANCO[0]
    }
    return null
  }


  useEffect(() => {
    if (CLABE && CLABE.length == 18) {
      setTipo('CLABE');
      setIcon('wallet');
      setShowBancos(true);
      const banco = getBanco(CLABE);
      if (banco) {
        handdleSelectBanco({
          ...banco,
          text: banco.nombre,
          value: banco.clave,

        });
      }
    }
    else if (CLABE && CLABE.length == 16) {
      setShowBancos(true);
      setTipo('TARJETA');
      setIcon('card');
    } else {
      setShowBancos(false);
      setTipo('KNOWN');
      setIcon('alert');
    }
  }, [CLABE]);



  return (
    <div className="max-w-md mx-auto">
      <button className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
          onClick={handleArchive}>
      <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
    <path d="M19 0H1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1ZM2 6v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6H2Zm11 3a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8a1 1 0 0 1 2 0h2a1 1 0 0 1 2 0v1Z"></path>
    </svg>
</button>
      <h2 className="font-bold mb-2 text-center">{isEditing ? 'Editar' : 'Añadir'} Nueva Cuenta</h2>

      <form className="p-4 mb-4 rounded-lg">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nombre del Titular
          </label>
          <input ref={refNombre}
            type="text"
            value={isEditing?selected?.nombre:nombreBeneficiario}
            onChange={(e) => setNombreBeneficiario(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre completo"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Cuenta
          </label>
          <input ref={refClabe}
            type="text"
            value={isEditing?selected?.CLABE:CLABE}
            onChange={(e) => setCLABE(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="CLABE"
            required
          />
        </div>
        {showBancos && <div className="mb-4 block" ref={dropdownRef}>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Banco
          </label>
          <SelectorBancos
            dropdownRef={dropdownRef}
            selected={selectedBanco}
            items={opcsBancos}
            onSelect={handdleSelectBanco} />
        </div>
        }
        <div className="flex space-x-4">
          <Button
            type="button"
            onClick={onCancelar}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useAPIContext } from '@/auth/useAPIContext';
import { FormularioNuevaCuenta } from './FormularioNuevaCuenta';
import { AuthToken } from '../tokenizer/AuthToken';
import { RresumenTransaccion } from './RresumenTransaccion';
import { operationResult, operationStatus, TPreTrasfer, TTransferRecept } from '@rute/types';
import { useAuthContext } from '@/auth';
import { SelectorReceptor } from '../SelectorReceptor';

interface IModalProfileProps {
  open: boolean;
  onOpenChange: () => void;
}
const cuentas = [

]

const EnviarModal = ({ open, onOpenChange }: IModalProfileProps) => {
  const [isEditing,setIsEditing]= useState(false);
  const { user } = useAuthContext()
  const { get } = useAPIContext();
  const [referencia, setReferencia] = useState('');
  const [concepto, setConcepto] = useState('');
  const [importe, setImporte] = useState('');
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [transaccion, setSransaccion] = useState<TPreTrasfer | undefined>(undefined);
  const [preTransaccion, setPreTransaccion] = useState<TPreTrasfer | undefined>(undefined);
  const [receptores, setReseptores] = useState<TTransferRecept[]>([])
  const [conceptoEditable, setConceptoEditable] = useState(true);
  const [selectedRecipient, setSelectedRecipient] = useState<TTransferRecept | undefined>(undefined);
  const importeRef = useRef<HTMLInputElement>(null);
  const conceptoRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<any | null>(null);
  const handleSeletReceptor = (receptor: TTransferRecept) => {
    if (receptor.BANCO == 'FONDEO') {
      const concepto = `FINN_${receptor.value}`
      setReferencia(Math.random().toString().slice(-6));
      setConcepto(concepto);
      importeRef?.current?.focus();
      setConceptoEditable(false)
    } else {
      setReferencia(Math.random().toString().slice(-6));
      setConcepto("");
      conceptoRef?.current?.focus();
      setConceptoEditable(true)
    }
    setSelectedRecipient(receptor);
  }
  
  // Manejar envío del formulario de transferencia
  const handleSubmit = (e: React.FormEvent) => {
    if (selectedRecipient) {
      const tipo = selectedRecipient.type;
      if (tipo == 'CLABE') {
        if (selectedRecipient.CLABE.length < 18 || !parseInt(selectedRecipient.CLABE)) {
          toast.error('Ingresa un Número de CLABE válido ' + selectedRecipient?.CLABE);
          return;
        }
      } else if (tipo == 'TELEFONO') {
        if (selectedRecipient.CLABE.length < 10 || !parseInt(selectedRecipient.CLABE)) {
          toast.error('Ingresa un Número de telefono váido ' + selectedRecipient.CLABE)
          return;
        }
      } else if (tipo == 'TARJETA') {
        if (selectedRecipient.CLABE.length < 16 || !parseInt(selectedRecipient?.CLABE)) {
          toast.error('Ingresa un Número de tarjeta váido')
          return;
        }
      } else if (tipo == 'FONDEO') {
        if (parseFloat(importe) < 10) {
          toast.error('El fondeo minimo es 10.00');
          importeRef?.current?.focus();
          return;
        }
      } else {
        toast.error('No has selecionado un cuenta receptora');
        return;
      }
      if (!concepto || concepto.length <= 0) {
        toast.error('Ingresa el concepto');
        conceptoRef?.current?.focus();
        return
      }

      const formateado = parseFloat(importe).toFixed(2); // Formatea el número a 2 decimales 
      setImporte(formateado);
      const params: TPreTrasfer = {
        TIPO: selectedRecipient?.type,
        BANCO: selectedRecipient?.BANCO,
        CLABE: selectedRecipient?.CLABE,
        nombreReceptor: selectedRecipient?.nombre,
        nombreEmisor: `${user?.NOMBRE} ${user?.APP} ${user?.APM}`,
        concepto,
        referencia,
        importe: formateado,
        clabeOrigen:user?.CLABE
      }
      setPreTransaccion(params)
      setMostrarResumen(true);
    }
  }
  // Manejar confirmación de transferencia
  const handleConfirmar = () => {
    setMostrarResumen(false);
    setSransaccion(preTransaccion)
  };

  // Manejar guardado de nueva cuenta
  const handleGuardarCuenta = (nuevaCuenta: TTransferRecept) => {
    setReseptores([...receptores, nuevaCuenta]);
    handleSeletReceptor(nuevaCuenta);
    setOpenNew(false);
  };

  const resetAll = () => {
    setPreTransaccion(undefined)
    setMostrarResumen(false);
    setSransaccion(undefined);
    setReferencia('');
    setConcepto('');
    setImporte('');
  }
  
  const handleChangeToken = (data: operationResult) => {
    if (data?.event === 'error') {
      setSransaccion(undefined)
    } else if (data?.event === 'despues') {
      resetAll()
      onOpenChange()
    } else if (data?.event === 'succeeded') {
      resetAll()
      onOpenChange()
    } else {
      resetAll()
      onOpenChange()
    }
  }

  useEffect(() => {
    if (open) {
      get('/contacts').then((response: any) => {
        const data = response.data as TTransferRecept[]
        setReseptores(data)
      })
    } else {
      resetAll();
    }
  }, [open])

  return (
    <Dialog open={open}  >
      <DialogContent className="max-w-[400px] p-2 overflow-hidden [&>button]:hidden">
        <DialogHeader className="p-0 border-0">
          <DialogTitle className="p-4 text-2xl font-bold text-gray-800 text-center">
            Transferir
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DialogBody className="scrollable-y " ref={parentRef}>
          {transaccion ? <>
            <AuthToken transaccion={transaccion} onChange={handleChangeToken} />
          </> : openNew ?
            <FormularioNuevaCuenta
              onGuardar={handleGuardarCuenta}
              onCancelar={() => setOpenNew(false)}
              isEditing={isEditing} 
              setIsEditing={setIsEditing}
              selected={selectedRecipient}
              items={receptores}
            /> : <>
              {mostrarResumen ?
                <RresumenTransaccion resumen={preTransaccion} onBack={() => setMostrarResumen(false)} onAcept={handleConfirmar} />
                : <div className="max-w-md mx-auto rounded-lg shadow-md">
                  <form onSubmit={handleSubmit} className='p-2'>
                    {/* Select con buscador y opción "Añadir cuenta" */}
                    <div className="mb-4 relative" ref={dropdownRef}>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Cuenta Destino
                      </label>
                      <SelectorReceptor
                          dropdownRef={dropdownRef}
                          selected={selectedRecipient}
                          items={receptores}
                          onSelect={handleSeletReceptor}
                          onAddNew={() => { setOpenNew(true); } } 
                          isEditing={isEditing} 
                          setIsEditing={setIsEditing}

                       />
                    </div>

                    {/* Campo Referencia */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Referencia
                      </label>
                      <input
                        type="number"
                        value={referencia}
                        onChange={(e) => setReferencia(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ingrese referencia"
                        required
                        //maxLength={6}
                      /> 
                    </div>

                    {/* Campo Concepto */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Concepto
                      </label>
                      <input
                        type="text"
                        ref={conceptoRef}
                        value={concepto}
                        readOnly={!conceptoEditable}
                        onChange={(e) =>{
                          const soloAlfanumerico = e.target.value.replace(/[^a-zA-Z0-9]/g, ''); 
                          setConcepto(soloAlfanumerico)
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Descripción del pago"
                        maxLength={40}
                        required
                      />
                    </div>
                    {/* Campo Monto */}
                    <div className="mb-6">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Monto
                      </label>
                      <input
                        type="number"
                        ref={importeRef}
                        value={importe}
                        onChange={(e) => setImporte(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                        min="0.01"
                        step="0.01"
                        required
                      />
                    </div>
                    {/* Botón Aceptar */}
                    <div className="flex space-x-4">
                      <button
                        type='submit'
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                      >
                        Aceptar
                      </button>
                      <button
                        onClick={onOpenChange}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                      >
                        Cancelar
                      </button>
                    </div>

                  </form>
                </div>}
            </>}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { EnviarModal };
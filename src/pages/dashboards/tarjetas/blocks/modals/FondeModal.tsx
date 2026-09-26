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
import { IDataIntecTC, TPreTrasfer, TTransferRecept } from '@rute/types';
import { useAuthContext } from '@/auth';

interface IModalProfileProps {
  open: boolean;
  onOpenChange: () => void;
  card?: IDataIntecTC | undefined
}
const cuentas = [

]
const FondeModal = ({ open, onOpenChange, card }: IModalProfileProps) => {
  const { user } = useAuthContext()
  const { get } = useAPIContext();
  const parentRef = useRef<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  // Referencia para el dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Manejar envío del formulario de transferencia
  const handleSubmit = (e: React.FormEvent) => {

  }

  useEffect(() => {

  }, [open])
  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-[400px] p-2 overflow-hidden ">
        <DialogHeader className="p-0 border-0">
          <DialogTitle>Fondear Tarjeta</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DialogBody className="scrollable-y " ref={parentRef}>
          <div className="max-w-md mx-auto p-6  rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className='p-2'>


              {/* Campo Monto */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Importe
                </label>
                <input
                  type="number"
                  // ref={importeRef}
                  value={''}
                  // onChange={(e) => setImporte(e.target.value)}
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
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { FondeModal };
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
import { TPreTrasfer, TTransferRecept } from '@rute/types';
import { useAuthContext } from '@/auth';
import { formatearMonedaMXN } from '@/utils/Money';

interface IModalProfileProps {
  open: boolean;
  onOpenChange: () => void;
}
const cuentas = [

]
const SolicitarTarjetasModal = ({ open, onOpenChange }: IModalProfileProps) => {
  const { user } = useAuthContext()
  const { get, post } = useAPIContext();
  const parentRef = useRef<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [ivaTotal, setIvaTotal] = useState<number>(0);
  const [subtotal, setSubotal] = useState<number>(0);
  const [precio, setPrecio] = useState<number>(60);
  const [iva, setIva] = useState<number>(0.16);
  const [loading, setLoading] = useState(false);

  // Referencia para el dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Manejar envío del formulario de transferencia
  const handleSubmit = async (e: React.FormEvent) => {
    if (loading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setLoading(true)
    e.preventDefault();
    e.stopPropagation();
    const params = {
      'total': total,
      'ivaTotal': ivaTotal,
      'subtotal': subtotal,
      'precio': precio,
      'iva': iva,
      'cantidad': cantidad
    }
    try {
      const response = await post('/tarjeta/solicita/tarjetas', params) as any
      const data = response?.data
      if (data.success && data?.result?.EstatusID == 1) {
        const result = data.result
        const folio = result.Folio
        const monto = result.MontoPago

        toast(`Solicitud de tarjetas`, {
          description: result.Mensaje || 'Solocitud Creada',
          action: {
            label: 'Ok',
            onClick: () => {
              onOpenChange()
            }
          }
        });
        setTimeout(() => {
          onOpenChange()
        }, 800)
      } else {
        setError(data.message)
      }
      setLoading(false);
    }
    catch (err: any) {
      setLoading(false);
      setError(err.message || 'Error al actualizar el correo');
      toast('Error de validación', {
        description: err.message || 'Error al actualizar el correo',
        action: {
          label: 'Ok',
          onClick: () => onOpenChange()
        }
      });
    }



  }

  useEffect(() => {
    if (cantidad > 0) {
      const impTotal = (cantidad * precio);
      setSubotal(impTotal)
      const ivaTotal = (impTotal * iva);
      setIvaTotal(ivaTotal)
      const total = impTotal + ivaTotal;
      setTotal(total);
    } else {
      setIvaTotal(0)
      setSubotal(0)
      setTotal(0)
    }
  }, [cantidad])
  useEffect(() => {

  }, [open])
  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-[400px] p-2 overflow-hidden ">
        <DialogHeader className="p-0 border-0">
          <DialogTitle>Solicitar Tarjetas</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DialogBody className="scrollable-y " ref={parentRef}>
          <div className="max-w-md mx-auto p-4  rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className='p-2'>
              <span role="info" className="text-info text-xs mt-1">
                Precio unitario de tarjeta es {formatearMonedaMXN(precio)} MXN
              </span>
              {/* Campo Referencia */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Cantidad de tarjetas
                </label>
                <input
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Cantidad de tarjetas a solicitar"
                  required
                />
                <label className="block text-gray-700 text-sm font-bold mb-2 p-1">
                  Subtotal: {formatearMonedaMXN(subtotal)}
                </label>
                <label className="block text-gray-700 text-sm font-bold mb-2 p-1">
                  IVA: {formatearMonedaMXN(ivaTotal)}
                </label>
                <label className="block text-gray-700 text-sm font-bold mb-2 p-1">
                  Total: {formatearMonedaMXN(total)}
                </label>
              </div>


              {/* Botón Aceptar */}
              <div className="flex space-x-4">
                <button
                  type='submit'
                  disabled={loading}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => { if (!loading) onOpenChange() }}
                  disabled={loading}
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

export { SolicitarTarjetasModal };
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
import { SelectorUser } from '../SelectorUser';

interface IModalProfileProps {
  open: boolean;
  onOpenChange: () => void;
}
const cuentas = [

]
const ConfigTarjetasModal = ({ open, onOpenChange }: IModalProfileProps) => {
  const { user } = useAuthContext()
  const { get } = useAPIContext();
  const parentRef = useRef<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [stpData, setStpData] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  // Referencia para el dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Manejar envío del formulario de transferencia
  const handleSubmit = (e: React.FormEvent) => {

  }
  const getMembers = () => {
    get('/members')
      .then((response: any) => {
        if (response && response.data) {
          const data = response.data as []
          const RS = data.map((item: any) => {
            return {
              NOMBRE: item?.NOMBRE,
              APP: item?.APP,
              APM: item?.APM,
              USR: item?.USR,
            }
          })
          setStpData(RS);
        }
      })
      .catch((err) => {
        console.error('[STP] Error al cargar cuentas:', err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleSeletReceptor = (user: any) => {
    setSelectedUser(user);
  }

  useEffect(() => {
    getMembers();
  }, [open])
  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-[600px] p-2 overflow-hidden ">
        <DialogHeader className="p-0 border-0">
          <DialogTitle>Configuración</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DialogBody className="scrollable-y " ref={parentRef}>
          <div className="max-w-4xl mx-auto p-6"> {/* Aumenté el max-width para 2 columnas */}
            <form onSubmit={handleSubmit} className="p-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Grid responsivo */}
                {error && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {error}
                  </span>
                )}

                {/* --- Columna 1 --- */}
                <div className="space-y-4">
                  {/* Código cliente */}
                  <div className="mb-4 relative" ref={dropdownRef}>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Cuenta origen de fondeo
                    </label>
                    <SelectorUser
                      dropdownRef={dropdownRef}
                      selected={selectedUser}
                      items={stpData}
                      onSelect={handleSeletReceptor} />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Cuenta de destino</label>
                    <input
                      type="text"
                      value='NA'
                      readOnly={true}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <h1 />

              {/* Botones (ocuparán ancho completo debajo de las columnas) */}
              <div className="flex space-x-4 mt-6"> {/* Añadí margen superior */}
                <button
                  disabled={loading}
                  type='button'
                  onClick={handleSubmit}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => { if (!loading) onOpenChange() }}
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

export { ConfigTarjetasModal };
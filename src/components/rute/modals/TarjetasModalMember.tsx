import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useResponsive, useViewport } from '@/hooks';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

import { useAPIContext } from '@/auth/useAPIContext';
import { TablaMovsMiTarjeta } from '@/pages/account/profile/blocks/tablas/TablaMovsMiTarjeta';
import { UserType } from '@/types';

interface IModalProfileProps {
  open: boolean;
  onOpenChange: () => void;
  member?: UserType;
}

const TarjetasModalMember = ({ open, onOpenChange, member }: IModalProfileProps) => {
  const { get, processResponse } = useAPIContext();
  const parentRef = useRef<any | null>(null);
  const [viewportHeight] = useViewport();
  const offset = 260;
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [misTarjetas, setMisTarjetas] = useState<any[] | undefined>(undefined);
  const [selectedCard, setSelectedCard] = useState<any | undefined>(undefined);

  useEffect(() => {
    if (open) {
      get('/profile/mistarjetas')
        .then((response: any) => {
          if (response.data && response.data.length > 0) {
            setMisTarjetas(response.data);
            setSelectedCard(response.data[0]); // Selecciona la primera tarjeta por defecto
          } else {
            setMisTarjetas([]);
            setSelectedCard(undefined);
          }
        })
        .catch((error) => {
          console.error("Error fetching cards:", error);
          setError("Error al cargar las tarjetas");
        });
    }
  }, [open]);

  const handleCardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cardId = e.target.value;
    const card = misTarjetas?.find(c => c.id === cardId);
    setSelectedCard(card);
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="container-fixed max-w-[auto] flex flex-col p-10 overflow-hidden">
        <DialogHeader className="p-0 border-0">
          <DialogTitle>Mi Tarjeta</DialogTitle>
        </DialogHeader>

        {/* Selector de tarjetas */}
        <div className="mb-4 mt-2">
          {misTarjetas && misTarjetas.length > 0 ? (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Seleccionar tarjeta
              </label>
              <select
                value={selectedCard?.id || ""}
                onChange={handleCardChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {misTarjetas.map((tarjeta) => (
                  <option key={tarjeta.id} value={tarjeta.id}>
                    {tarjeta.label} •••• {tarjeta.last4}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-gray-500 py-2">
              {misTarjetas === undefined
                ? "Cargando tarjetas..."
                : "No tienes tarjetas registradas"}
            </p>
          )}
        </div>

        {/* Contenido de la tarjeta seleccionada */}
        <DialogDescription className="mb-2">
          {selectedCard && (
            <div className="flex justify-between items-center">
              <span>{selectedCard.label}</span>
              <span>•••• {selectedCard.last4}</span>
            </div>
          )}
        </DialogDescription>

        <DialogBody className="scrollable-y py-0 mb-5 ps-0 pe-3 -me-7" ref={parentRef}>
          <div className="flex grow gap-5 lg:gap-7.5">
            <div className="flex flex-col items-stretch grow gap-5 lg:gap-7.5">
              {selectedCard ? (
                <TablaMovsMiTarjeta card={selectedCard} />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {misTarjetas?.length === 0
                    ? "No hay datos disponibles"
                    : "Selecciona una tarjeta para ver los movimientos"}
                </div>
              )}
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { TarjetasModalMember };

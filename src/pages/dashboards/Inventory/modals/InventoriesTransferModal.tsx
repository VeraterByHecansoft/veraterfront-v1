import React, { useState } from 'react';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

import { useAPIContext } from '@/auth/useAPIContext';
import TransferForm from '../blocks/TransferForm';

interface IModaleProps {
  open: boolean;
  onOpenChange: () => void;
}


const InventoriesTransferModal = ({ open, onOpenChange }: IModaleProps) => {
  const {get,processResponseDirect} = useAPIContext()
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="container-fixed max-w-[auto] flex flex-col p-10 overflow-hidden [&>button]:hidden">
      <DialogHeader className="p-0 border-0">
          <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5">
            <div className="flex flex-col justify-center gap-2">
              <DialogTitle className="text-xl font-bold">Transferencia entre almacenes</DialogTitle>
              <DialogDescription> </DialogDescription>
            </div>
            <button className="btn btn-sm btn-light" onClick={!saving?onOpenChange:()=>{}}>
              Cerrar
            </button>
          </div>
        </DialogHeader>
        <DialogBody className="scrollable-y py-0 mb-5 ps-0 pe-3 -me-7" >
        <TransferForm />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { InventoriesTransferModal };

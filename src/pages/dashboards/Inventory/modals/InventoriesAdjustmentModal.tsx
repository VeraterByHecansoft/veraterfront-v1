import { useState } from 'react';

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
import InventoryAdjustment, { InventoryForm } from '../blocks/InventoryAdjustment';

interface IModaleProps {
  open: boolean;
  onOpenChange: () => void;
}

const InventoriesAdjustmentModal = ({ open, onOpenChange }: IModaleProps) => {
  const { get, post, processResponseDirect, processResponse } = useAPIContext()
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);


  const fetchProducts = async (query: string) => { // ajax
    const queryParams = new URLSearchParams();
    queryParams.set('query', query);
    const response = await get(`product`, `${queryParams.toString()}`);
    const data = await processResponseDirect({ response });
    if (data?.results && data?.results.length > 0) {
      const results = data.results.map((c: any) => ({ value: c._id, label: `${c.name} ${c.sku}` }));
      return [...results, { value: 'root', label: 'Categoria Raiz' }]
    } else {
      return []
    }
  }

  const fetchWarehouses = async (query: string) => {
    const queryParams = new URLSearchParams();
    queryParams.set('query', query);
    const response = await get(`warehouse`, `${queryParams.toString()}`);
    const data = await processResponseDirect({ response });
    if (data?.results && data?.results.length > 0) {
      const results = data.results.map((c: any) => ({ value: c._id, label: c.name }));
      return [...results]
    } else {
      return []
    }
  }
  const submitAdjustment = async (form: InventoryForm) => {
    const response = await post('/product', form);
    const data = await processResponse({ response, setError, setMessage, setData: loadSuccess });
    return { message: data.message };
  }
  const loadSuccess = (data: any) => {
    console.log(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="container-fixed max-w-[auto] flex flex-col p-10 overflow-hidden [&>button]:hidden">
        <DialogHeader className="p-0 border-0">
          <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5">
            <div className="flex flex-col justify-center gap-2">
              <DialogTitle className="text-xl font-bold">Ajuste de Inventario</DialogTitle>
              <DialogDescription> </DialogDescription>
            </div>
            <button className="btn btn-sm btn-light" onClick={!saving ? onOpenChange : () => { }}>
              Cerrar
            </button>
          </div>
        </DialogHeader>
        <DialogBody className="scrollable-y py-0 mb-5 ps-0 pe-3 -me-7" >
          <InventoryAdjustment fetchProducts={fetchProducts} fetchWarehouses={fetchWarehouses} submitAdjustment={submitAdjustment} />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { InventoriesAdjustmentModal };

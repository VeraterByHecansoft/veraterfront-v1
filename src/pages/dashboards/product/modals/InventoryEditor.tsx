import { SearchableSelect } from '@/components/ui/SearchableSelect';
import React, { useState } from 'react';

type TInventory = {
  warehouse: string;
  quantity: number;
};

interface InventoryEditorProps {
  initial?: TInventory[];
  fetchWarehouses: (query: string) => Promise<{ label: string; value: string }[]>;
  onChange?: (data: TInventory[]) => void;
//   SearchableSelect: React.FC<{
//     value: string;
//     onValueChange: (val: string) => void;
//     placeholder: string;
//     fetchOptions: (query: string) => Promise<{ label: string; value: string }[]>;
//   }>;
}

export const InventoryEditor: React.FC<InventoryEditorProps> = ({
  initial = [],
  fetchWarehouses,
  onChange,
//   SearchableSelect
}) => {
  const [items, setItems] = useState<TInventory[]>(initial);

  const updateItem = (index: number, key: keyof TInventory, value: string | number) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [key]: key === 'quantity' ? parseInt(String(value)) || 0 : value
    };
    setItems(updated);
    onChange?.(updated);
  };

  const addItem = () => {
    const updated = [...items, { warehouse: '', quantity: 0 }];
    setItems(updated);
    onChange?.(updated);
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    onChange?.(updated);
  };

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-1/2">
            <SearchableSelect
              value={item.warehouse}
              onValueChange={(val) => updateItem(index, 'warehouse', val)}
              placeholder="Selecciona el almacén"
              fetchOptions={fetchWarehouses}
            />
          </div>
          <input
            type="number"
            className="w-1/4 border px-2 py-1 rounded"
            placeholder="Cantidad"
            value={item.quantity}
            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
          />
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="text-red-500 hover:underline"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="self-start bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        + Añadir inventario
      </button>
    </div>
  );
};

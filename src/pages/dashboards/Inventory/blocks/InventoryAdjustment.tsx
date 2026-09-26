import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect } from "@/components/ui/SearchableSelect";

export type InventoryForm = {
  product: string;
  warehouse: string;
  quantity: number;
  note: string;
};

type InventoryAdjustmentProps = {
  fetchProducts: (query:string) => Promise<{ label: string; value: string }[]>;
  fetchWarehouses: (query:string) => Promise<{ label: string; value: string }[]>;
  submitAdjustment: (form: InventoryForm) => Promise<{ message: string,error?: string }>;
};

const InventoryAdjustment = ({
  fetchProducts,
  fetchWarehouses,
  submitAdjustment,
}: InventoryAdjustmentProps) => {
  const [form, setForm] = useState<InventoryForm>({
    product: "",
    warehouse: "",
    quantity: 0,
    note: "",
  });

  const [message, setMessage] = useState<string>("");

  const handleChange = (field: keyof InventoryForm, value: string | number) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: field === "quantity" ? Number(value) : value,
    }));
  };

  const submit = async () => {
    if (form.product && form.warehouse && form.quantity !== 0) {
      try {
        const response = await submitAdjustment(form);
        setMessage(response.message);
        setForm({ product: "", warehouse: "", quantity: 0, note: "" });
      } catch (error) {
        console.error(error);
        setMessage("Error al realizar el ajuste");
      }
    } else {
      setMessage("Por favor completa todos los campos correctamente");
    }
  };

  return (
    <div className="p-4  space-y-4">
      <h2 className="text-xl font-bold">Ajuste de Inventario</h2>

      <SearchableSelect
        value={form.product}
        onValueChange={(value: string) => handleChange("product", value)}
        placeholder="Selecciona el producto"
        fetchOptions={fetchProducts}
      />

      <SearchableSelect
        value={form.warehouse}
        onValueChange={(value: string) => handleChange("warehouse", value)}
        placeholder="Selecciona el almacén"
        fetchOptions={fetchWarehouses}
      />

      <Input
        type="number"
        placeholder="Cantidad (puede ser negativa)"
        value={form.quantity}
        onChange={(e) => handleChange("quantity", e.target.value)}
      />

      <Textarea
        placeholder="Nota (opcional)"
        value={form.note}
        onChange={(e) => handleChange("note", e.target.value)}
      />

      <div className="flex justify-end">
        <Button onClick={submit}>Ajustar Inventario</Button>
      </div>

      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};

export default InventoryAdjustment;

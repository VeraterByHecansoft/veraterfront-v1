import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { useAPIContext } from "@/auth/useAPIContext";

export default function TransferForm() {
    const {processResponseDirect,processResponse,post, get} = useAPIContext();
    const [form, setForm] = useState({ product: "", from: "", to: "", quantity: "", note: "" });
    const [message, setMessage] = useState("");
    const [erro, setError] = useState("");


  const handleChange = (key: string, value: string) => setForm({ ...form, [key]: value });

  const submit = async () => {
    try {
        const response = await post("/inventory/transfer", form);
        await processResponse({ response, setError, setMessage, setData:(data)=>{

        }});
      setForm({ product: "", from: "", to: "", quantity: "", note: "" });
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Error al transferir.");
    }
  };
  

  const fetchProducts = async (query:string) =>  {
    const queryParams = new URLSearchParams();
    queryParams.set('query', query);
    const response = await get(`product`,`${queryParams.toString()}`);
    const data = await processResponseDirect ({ response});
    if(data?.results && data?.results.length>0){
      const results = data.results.map((c: any) => ({ value: c._id, label: `${c.name} ${c.sku}` }));
      return  [...results,{value:'root',label:'Categoria Raiz'}]
    }else{
      return []
    }
  }


  const fetchWherehouses = async (query:string) =>  {
    const queryParams = new URLSearchParams();
    queryParams.set('query', query);
    const response = await get(`warehouse`,`${queryParams.toString()}`);
    const data = await processResponseDirect ({ response});
    if(data?.results && data?.results.length>0){
      const results = data.results.map((c: any) => ({ value: c._id, label: `${c.name}` }));
      return  [...results]
    }else{
      return []
    }
  }

  
  return (
    <div className="p-4  space-y-4">
    {/* <h2 className="text-xl font-bold">Transferencia entre almacenes</h2> */}

    <SearchableSelect
      value={form.product || ""}
      onValueChange={(product: string) => handleChange("product", product)}
      placeholder="Selecciona el producto"
      fetchOptions={fetchProducts}
    />

    <div className="grid grid-cols-2 gap-4">
      <SearchableSelect
        value={form.from || ""}
        onValueChange={(from: string) => handleChange("from", from)}
        placeholder="Desde almacén"
        fetchOptions={fetchWherehouses}
      />
      <SearchableSelect
        value={form.to || ""}
        onValueChange={(to: string) => handleChange("to", to)}
        placeholder="Hacia almacén"
        fetchOptions={fetchWherehouses}
      />
    </div>

    <Input
      placeholder="Cantidad"
      type="number"
      value={form.quantity}
      onChange={(e) => handleChange("quantity", e.target.value)}
    />

    <Textarea
      placeholder="Nota (opcional)"
      value={form.note}
      onChange={(e) => handleChange("note", e.target.value)}
    />

<div className="text-right">
    <Button onClick={submit}>Transferir</Button>
  </div>

    {message && <p className="text-sm text-muted-foreground">{message}</p>}
  </div>
  );
}

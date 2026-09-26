import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useAPIContext } from '@/auth/useAPIContext';
import { AllInventoriesModal } from './modals/AllInventoriesModal';
import { InventoriesTransferModal } from './modals/InventoriesTransferModal';
import { InventoriesAdjustmentModal } from './modals/InventoriesAdjustmentModal';

const InventoryPageContent = () => {
  const {get, processResponse} = useAPIContext()
  const [summary, setSummary] = useState<any| null>(null);
  const [lowStock, setLowStock] = useState<Array<any>>([]);
  const [error,setError] =useState('')
  const [message,setMessage] = useState('');
  const [allIsOpen, setAllIsOpen] =  useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [ajusteOpen, setAjusteOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const r1 = await get('/inventory/summary');
      await processResponse({ response:r1, setError, setMessage, setData:(data)=>{
        setSummary(data)
      } });

      const r2 = await get('/inventory/alerts');
      await processResponse({ response:r2, setError, setMessage, setData:(data)=>{
        setLowStock(data);
      } });
    };
    fetchData();
  }, []);

  return (
    <div className="grid gap-5 lg:gap-7.5">
        <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Resumen de Inventario</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card><CardContent className="p-4"><div className="text-sm">Productos</div><div className="text-xl font-bold">{summary?.totalProducts}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-sm">Unidades en stock</div><div className="text-xl font-bold">{summary?.totalUnits}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-sm">Stock bajo</div><div className="text-xl font-bold">{summary?.lowStockCount}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-sm">Sin stock</div><div className="text-xl font-bold">{summary?.outOfStockCount}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-sm">Sucursales/Almacenes</div><div className="text-xl font-bold">{summary?.locations}</div></CardContent></Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Alertas de inventario</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2">Producto</th>
                <th className="p-2">Ubicación</th>
                <th className="p-2">Stock</th>
                <th className="p-2">Mínimo</th>
                <th className="p-2">🔔</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.warehouse}</td>
                  <td className="p-2">{item.stock}</td>
                  <td className="p-2">{item.min}</td>
                  <td className="p-2">{item.stock === 0 ? "❌" : "⚠️"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Productos con más y menos stock</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={lowStock}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="stock" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={()=>{setAjusteOpen(true)}}>Nuevo ajuste de inventario</Button>
        <Button variant="outline" onClick={()=>{setAllIsOpen(true)}}>Ver todo el inventario</Button>
        <Button variant="secondary" onClick={()=>{setTransferOpen(true)}}>Transferencia entre almacenes</Button>
      </div>
    </div>
      <AllInventoriesModal open={allIsOpen} onOpenChange={()=>{setAllIsOpen(false)}}/>
      <InventoriesTransferModal open={transferOpen} onOpenChange={()=>{setTransferOpen(false)}}/>
      <InventoriesAdjustmentModal open={ajusteOpen} onOpenChange={()=>{setAjusteOpen(false)}}/>

      
    </div>
  );
};

export { InventoryPageContent };

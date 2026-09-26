import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {  Plus } from "lucide-react";
import Warehouses from "./Warehouses";
import { useAPIContext } from "@/auth/useAPIContext";
import { toast } from "sonner";
import { formatIsoDate } from "@/utils/Date";
import { AddWarehouseModal } from "../modals/AddWarehouseModal";
import { formatCurrency } from "@/utils/number";
    
type TlastActivity = {
     name: string;
    lastUpdate: string;
}
type TtopStore = {
    name:string;
    totalStock:string
}

export default function Summary() {
  const {get,processResponseDirect} = useAPIContext();
  const [totalStores, setTotalStores] = useState('?');
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [lowStockStores, setLowStockStores] = useState('?');
  const [topStore, setTopStore] =  useState<TtopStore|undefined>(undefined);
  const [lastActivity, setLastActivity] =  useState<TlastActivity|undefined>(undefined);
  
  const handleSave = ()=>{
    setIsOpenAdd(false)
  }
      
  const fetchSummary = async () => {
      try {
      const queryParams = new URLSearchParams();
      const response = await get('warehouse/summary',`${queryParams.toString()}`);
      const data =await processResponseDirect ({ response});
              setTotalStores(data.totalStores)
              setLowStockStores(data.lowStockStores)
              setTopStore(data.topStore)
              setLastActivity(data.lastActivity )
      } catch (error) {
          toast(`Connection Error`, {
              description: `An error occurred while fetching data. Please try again later`,
              action: {
              label: 'Ok',
              onClick: () => console.log('Ok')
              }
          });
      }
  };
  
  useEffect(()=>{
      fetchSummary();
  },[]);


  return (
    <div className="p-6 space-y-6">
      {/* Acciones */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Resumen de Sucursales</h2>
        <div className="flex gap-2">
          <Button className="flex items-center gap-2" onClick={()=>{setIsOpenAdd(true)}}>
            <Plus size={16} />
            Nueva sucursal
          </Button>
        </div>
      </div>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500 mb-1">Total de sucursales activas</div>
            <div className="text-2xl font-bold text-gray-800">{totalStores}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500 mb-1">Con bajo inventario</div>
            <div className="text-2xl font-bold text-red-600">{lowStockStores}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500 mb-1">Sucursal con más ventas (últ. mes)</div>
            <div className="text-lg font-semibold text-gray-800">{topStore&&topStore.name}</div>
            <div className="text-sm text-gray-500">{topStore&&formatCurrency(topStore.totalStock)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500 mb-1">Última actividad registrada</div>
            <div className="text-lg font-semibold text-gray-800">{lastActivity&&lastActivity.name}</div>
            <div className="text-sm text-gray-500">{lastActivity&&formatIsoDate(lastActivity.lastUpdate)}</div>
          </CardContent>
        </Card>
        
      </div>
      <Warehouses/>
      <AddWarehouseModal open={isOpenAdd} onOpenChange={handleSave} />
    </div>
  );
}

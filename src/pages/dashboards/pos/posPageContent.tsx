import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useAPIContext } from '@/auth/useAPIContext';
import PointOfSale from './blocks/PointOfSale';




const PosPageContent = () => {
  const {get, processResponse} = useAPIContext()
  const [error,setError] =useState('')
  const [message,setMessage] = useState('');

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="p-6 space-y-6">
        {/* <h1 className="text-2xl font-bold">Resumen de Inventario</h1> */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card><CardContent className="p-4"><div className="text-sm">Productos</div><div className="text-xl font-bold">{summary?.totalProducts}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-sm">Unidades en stock</div><div className="text-xl font-bold">{summary?.totalUnits}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-sm">Stock bajo</div><div className="text-xl font-bold">{summary?.lowStockCount}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-sm">Sin stock</div><div className="text-xl font-bold">{summary?.outOfStockCount}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-sm">Sucursales/Almacenes</div><div className="text-xl font-bold">{summary?.locations}</div></CardContent></Card>
        </div> */}

        <PointOfSale/>

      
      </div>
    </div>
  );
};

export { PosPageContent };

import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useAPIContext } from '@/auth/useAPIContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { semana: "01-07", ventas: 8000 },
  { semana: "08-14", ventas: 12500 },
  { semana: "15-21", ventas: 10000 },
  { semana: "22-28", ventas: 14700 },
  { semana: "29-05", ventas: 16200 },
];

const Summary = () => {
  const {get,processResponseDirect,post,put,postMultipart,processResponse,putMultipart} = useAPIContext();
  const [isOpenModal, setIsOpenModal] =  useState(false);

  return (
<Fragment>
<div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {/* KPIs */}
      <Card className='shadow'>
        <CardContent className="p-4">
          <div className="text-sm text-gray-500 mb-1">Total vendido (mes)</div>
          <div className="text-2xl font-bold text-gray-800">$120,000</div>
        </CardContent>
      </Card>

      <Card className='shadow'>
        <CardContent className="p-4">
          <div className="text-sm text-gray-500 mb-1">Ventas en proceso</div>
          <div className="text-2xl font-bold text-gray-800">24</div>
        </CardContent>
      </Card>

      <Card className='shadow'>
        <CardContent className="p-4">
          <div className="text-sm text-gray-500 mb-1">Pedidos entregados</div>
          <div className="text-2xl font-bold text-gray-800">310</div>
        </CardContent>
      </Card>

      <Card className='shadow'>
        <CardContent className="p-4">
          <div className="text-sm text-gray-500 mb-1">Facturas pendientes</div>
          <div className="text-2xl font-bold text-gray-800">7</div>
        </CardContent>
      </Card>

      {/* Gráfica de ventas */}
      <Card className="col-span-4 xl:col-span-4 shadow p-4">
        <h3 className="text-gray-800 text-lg font-semibold mb-4">
          Ventas por semana
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="semana" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="ventas"
              stroke="#2563EB"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Últimas ventas */}
      <Card className="col-span-1 md:col-span-2 xl:col-span-3 shadow p-4">
        <h3 className="text-gray-800 text-lg font-semibold mb-4">Últimas ventas</h3>
        <table className="w-full text-sm text-gray-700">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="pb-2">Cliente</th>
              <th className="pb-2">Fecha</th>
              <th className="pb-2">Monto</th>
              <th className="pb-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Juan Pérez</td>
              <td>05/05/2025</td>
              <td>$3,200</td>
              <td className="text-green-600">Entregado</td>
            </tr>
            <tr>
              <td>Acme S.A.</td>
              <td>04/05/2025</td>
              <td>$7,500</td>
              <td className="text-yellow-600">En proceso</td>
            </tr>
            <tr>
              <td>Globex Ltd.</td>
              <td>02/05/2025</td>
              <td>$2,100</td>
              <td className="text-red-600">Cancelado</td>
            </tr>
          </tbody>
        </table>
      </Card>

      {/* Productos más vendidos */}
      <Card className='shadow'>
        <CardContent className="p-4">
        <h3 className="text-gray-800 text-lg font-semibold mb-4">Top productos</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>📦 Producto A — 120 unidades</li>
          <li>📦 Producto B — 90 unidades</li>
          <li>📦 Producto C — 75 unidades</li>
        </ul>
        </CardContent>
      </Card>
      <div className="col-span-1 md:col-span-2 xl:col-span-4 shadow p-4 flex flex-wrap gap-2">
        <Button onClick={()=>{}}>Registrar venta manual</Button>
        <Button variant="outline" onClick={()=>{}}>Buscar de ventas</Button>
        <Button variant="outline" onClick={()=>{}}>Descargar deporte</Button>
        <Button variant="secondary" onClick={()=>{}}>Generar Factura</Button>
        <Button variant="secondary" onClick={()=>{}}>Cargar Factura</Button>
        <Button variant="secondary" onClick={()=>{}}>Buscar Factura</Button>
      </div>
    </div>
</Fragment>
  );
};

export { Summary };

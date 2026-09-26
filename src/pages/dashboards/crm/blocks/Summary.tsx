import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useAPIContext } from '@/auth/useAPIContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


const Summary = () => {
  const {get,processResponseDirect,post,put,postMultipart,processResponse,putMultipart} = useAPIContext();
  const [isOpenModal, setIsOpenModal] =  useState(false);



  return (
<Fragment>
<div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {/* KPIs */}
    <Card>
        <CardContent className="p-4">
            <div className="text-lg font-semibold mb-4">Clientes activos</div>
            <div className="text-xl font-bold">150</div>
        </CardContent> 
    </Card>
    <Card>
        <CardContent className="p-4">
            <div className="text-lg font-semibold mb-4">Seguimientos de hoy</div>
            <div className="text-xl font-bold">5</div>
        </CardContent> 
    </Card>
    <Card>
        <CardContent className="p-4">
            <div className="text-lg font-semibold mb-4">Tareas pendientes</div>
            <div className="text-xl font-bold">5</div>
        </CardContent> 
    </Card>
    {/* Agenda */}
    <Card>
        <CardContent className="p-4">
            <div className="text-lg font-semibold mb-4">Agenda</div>
            <div className="text-xl  font-bold">
                <ul className="space-y-2 text-sm text-gray-700">
                    <li>📞 Llamada con Juan Pérez - 10:00 AM</li>
                    <li>🗓 Reunión con Acme Inc. - 2:00 PM</li>
                    <li>📤 Enviar propuesta a María Gómez - 18/04/2024</li>
                </ul>
            </div>
        </CardContent> 
    </Card>

    {/* Oportunidades recientes */}
    <Card>
        <CardContent className="p-4">
            <div className="text-lg font-semibold mb-4">Oportunidades recientes</div>
            <table className="w-full text-sm text-gray-700">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="pb-2">Oportunidad</th>
              <th className="pb-2">Etapa</th>
              <th className="pb-2">Monto</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Acme Inc.</td>
              <td>Negociación</td>
              <td>$15,000</td>
            </tr>
            <tr>
              <td>Globex Corp</td>
              <td>Propuesta enviada</td>
              <td>$20,000</td>
            </tr>
            <tr>
              <td>Soylent Corp</td>
              <td>Contactado</td>
              <td>$10,000</td>
            </tr>
          </tbody>
        </table>
        </CardContent> 
    </Card>
    
    {/* Últimos clientes */}
    <Card>
        <CardContent className="p-4">
            <div className="text-lg font-semibold mb-4">Últimos clientes</div>
            <table className="w-full text-sm text-gray-700">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="pb-2">Nombre</th>
              <th className="pb-2">Contacto</th>
              <th className="pb-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Juan Pérez</td>
              <td>juan@example.com</td>
              <td>20/04/2024</td>
            </tr>
            <tr>
              <td>Acme Inc.</td>
              <td>ana@example.com</td>
              <td>20/04/2024</td>
            </tr>
            <tr>
              <td>María Gómez</td>
              <td>maria@example.com</td>
              <td>18/04/2024</td>
            </tr>
          </tbody>
        </table>
        </CardContent> 
    </Card>

      {/* Notas */}
      <Card>
      <CardContent className="p-4">
            <div className="text-lg font-semibold mb-4">Notas</div>
        <textarea
          placeholder="Añadir una nota..."
          className="w-full border rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        //   rows="4"
        ></textarea>
      </CardContent>
      </Card>

      <div className="col-span-1 md:col-span-2 xl:col-span-3 shadow p-4 flex flex-wrap gap-2">
        <Button onClick={()=>{}}>Registrar Cliente</Button>
        <Button variant="outline" onClick={()=>{}}>Descargar deporte</Button>
        <Button variant="secondary" onClick={()=>{}}>Buscar Cliente</Button>
      </div>
    </div>
</Fragment>
  );
};

export { Summary };

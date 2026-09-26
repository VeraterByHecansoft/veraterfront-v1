/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import { Column, RowSelectionState } from '@tanstack/react-table';
import { DataGrid, DataGridColumnVisibility, useDataGrid } from '@/components';

import { useAPIContext } from '@/auth/useAPIContext';
import { IDataIntecTC } from '@rute/types';
import { Columnas } from '../Columnas';
import { AsignarTarjetaModal } from '../modals/AsignarTarjetaModal';
import { ColumnasNas } from '../ColumnasNas';


const TablaSinAsignadar = () => {
  const { get } = useAPIContext();
  const [stpData, setStpData] = useState<IDataIntecTC[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAsign, setModalAsign] = useState(false)
  const [selectedCard, setSelectedCard] = useState<IDataIntecTC | undefined>(undefined)

  const loadData = () => {
    setLoading(true)
    get(`/tarjetas/noasignadas`).then((response: any) => {
      const movs = response?.data as IDataIntecTC[]
      const M = movs.map((doc, index) => {
        const f = { ...doc, id: `${index}` }
        return f
      })
      setLoading(false);
      setStpData(M)
    }).catch(err => { })
  }

  useEffect(() => {
    loadData()
  }, []);

  const handleAsign = (card: IDataIntecTC) => {
    setSelectedCard(card);
    setModalAsign(true);
  }

  const columns = ColumnasNas({
    onAsign: handleAsign,
  })

  const handleRowSelection = (state: RowSelectionState) => {
    const selectedRowIds = Object.keys(state);
    if (selectedRowIds.length > 0) {
    }
  };

  const Toolbar = () => {
    const { table } = useDataGrid();
    const isFiltered = table.getState().columnFilters.length > 0
    return (
      <div className="card-header border-b-0 px-5 flex-wrap">
        <h3 className="card-title">Movimientos</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <DataGridColumnVisibility table={table} />
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-7.5">
      <div className="col-span-3">
        <div className="flex flex-col gap-5 lg:gap-7.5">
          <div className="flex gap-5 lg:gap-7.5">
            <div className={`card grow `}>
              <DataGrid
                columns={columns}
                data={stpData}
                rowSelection={true}
                onRowSelectionChange={handleRowSelection}
                pagination={{ size: 50 }}
                sorting={[{ id: 'NoTarjeta', desc: false }]}
                toolbar={<Toolbar />}
                messages={{ loading: 'Cargando...' }}
                layout={{ card: true }}
              />
            </div>
          </div>
        </div>
      </div>
      {selectedCard&&<AsignarTarjetaModal open={modalAsign} data={selectedCard} onOpenChange={()=>{setModalAsign(false)}} />}
    </div>
  );
};

export { TablaSinAsignadar };

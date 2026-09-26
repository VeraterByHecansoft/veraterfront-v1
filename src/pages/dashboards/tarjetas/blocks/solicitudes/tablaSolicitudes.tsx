/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import {  RowSelectionState } from '@tanstack/react-table';
import { DataGrid, DataGridColumnVisibility, useDataGrid } from '@/components';
import { useAPIContext } from '@/auth/useAPIContext';
import { IDataColicitud } from '@rute/types';
import { ColumnasSol } from './ColumnasSol';


const TablaSolicitudes = () => {
  const { get } = useAPIContext();
  const [stpData, setStpData] = useState<IDataColicitud[]>([]);

  const [modalView, setModalView] = useState(false)
  const [selectedCard, setSelectedCard] = useState<IDataColicitud | undefined>(undefined)

  const loadData = () => {
    get(`/tarjetas/solicitudes`).then((response: any) => {
      const movs = response?.data as IDataColicitud[]
      const M = movs.map((doc, index) => {
        const f = { ...doc, id: `${index}` }
        return f
      })
      setStpData(M)
    }).catch(err => { })
  }

  useEffect(() => {
    loadData()
  }, []);


  const handleOnView = (card: IDataColicitud) => {
    setSelectedCard(card)
    setModalView(true);
  }

  const columns = ColumnasSol({
    onView: handleOnView,
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
        <h3 className="card-title">Solicitudes</h3>
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
                sorting={[{ id: 'cod', desc: false }]}
                toolbar={<Toolbar />}
                messages={{ loading: 'Cargando...' }}
                layout={{ card: true }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* <MovsListModal open={modalView} onOpenChange={() => { setModalView(false) }} card={selectedCard} /> */}
    </div>
  );
};

export { TablaSolicitudes };

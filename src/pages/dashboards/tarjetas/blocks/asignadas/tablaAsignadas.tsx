/* eslint-disable prettier/prettier */
import { useEffect, useMemo, useState } from 'react';
import { Column, ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { DataGrid, DataGridColumnHeader, DataGridColumnVisibility, DataGridRowSelect, DataGridRowSelectAll, useDataGrid, CustomIcon } from '@/components';
import { useAPIContext } from '@/auth/useAPIContext';
import { IDataIntecTC } from '@rute/types';
import { Columnas } from '../Columnas';
import { MovsListModal } from '../modals';
import { FondeModal } from '../modals/FondeModal';
import { EcommerceModal } from '../modals/EcommerceModal';
import { setBloked } from '@/contexts/store/slicers/authSlice';
import { BloquearModal } from '../modals/BloquearModal';
interface TablaAsignadasProps {
  onLoaded?:(status:boolean) => void;
}

const TablaAsignadas = ({onLoaded}:TablaAsignadasProps) => {
  const { get } = useAPIContext();
  const [stpData, setStpData] = useState<IDataIntecTC[]>([]);

  const [modalView, setModalView] = useState(false)
  const [modalFondeo, setModalFondeo] = useState(false)
  const [modalBlock, setModalBlock] = useState(false)
  const [modalEcommerce, setModalEcommerce] = useState(false)
  const [selectedCard, setSelectedCard] = useState<IDataIntecTC | undefined>(undefined)

  const loadData = () => {
    get(`/tarjetas/asignadas`).then((response: any) => {
      const movs = response?.data as IDataIntecTC[]
      const M = movs.map((doc, index) => {
        const f = { ...doc, id: `${index}` }
        return f
      })
      onLoaded?.(true)
      setStpData(M)
    }).catch(err => { })
  }

  useEffect(() => {
    loadData()
  }, []);


  const handleOnView = (card: IDataIntecTC) => {
    setSelectedCard(card)
    setModalView(true);

  }
  const handleBlock = (card: IDataIntecTC) => {
    setSelectedCard(card)
    setModalBlock(true)

  }
  const handleFondeo = (card: IDataIntecTC) => {
    setSelectedCard(card);
    setModalFondeo(true);
  }
  const handleEcomerce = (card: IDataIntecTC) => {
    setSelectedCard(card);
    setModalEcommerce(true);
  }

  const columns = Columnas({
    onView: handleOnView,
    onBlock: handleBlock,
    onFondeo: handleFondeo,
    onEcomerce: handleEcomerce
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
      <MovsListModal open={modalView} onOpenChange={() => { setModalView(false) }} card={selectedCard} />
      <FondeModal open={modalFondeo} onOpenChange={() => { setModalFondeo(false) }} card={selectedCard} />
      <EcommerceModal open={modalEcommerce} onOpenChange={() => { setModalEcommerce(false) }} card={selectedCard} />
      <BloquearModal open={modalBlock} onOpenChange={() => { setBloked(false) }} card={selectedCard} />
    </div>
  );
};

export { TablaAsignadas };

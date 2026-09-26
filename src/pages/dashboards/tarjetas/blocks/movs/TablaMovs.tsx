/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import { RowSelectionState } from '@tanstack/react-table';
import { CustomIcon, DataGrid, DataGridColumnVisibility, DataGridRowSelect, DataGridRowSelectAll, useDataGrid, } from '@/components';
import { useAPIContext } from '@/auth/useAPIContext';
import { IDataIntecTC, IDataIntecTCMov } from '@rute/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ColumnasMovs } from '../ColumnasMovs';
interface TablaMovsProps {
  card?: IDataIntecTC | undefined
}

const MESE = [
  { value: 0, label: 'Enero' },
  { value: 1, label: 'Febrero' },
  { value: 2, label: 'Marzo' },
  { value: 3, label: 'Abril' },
  { value: 4, label: 'Mayo' },
  { value: 5, label: 'Junio' },
  { value: 6, label: 'Julio' },
  { value: 7, label: 'Agosto' },
  { value: 8, label: 'Septiembre' },
  { value: 9, label: 'Octubre' },
  { value: 10, label: 'Noviembre' },
  { value: 11, label: 'Diciembre' },
]

const TablaMovs = ({ card }: TablaMovsProps) => {
  const { get } = useAPIContext();
  const [stpData, setStpData] = useState<IDataIntecTCMov[]>([]);
  const [modalView, setModalView] = useState(false)
  const [selectedCard, setSelectedCard] = useState<IDataIntecTC | undefined>(undefined)
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());

  const years = Array.from({ length: 8 }, (_, i) => 2026 - i);

  const loadData = () => {
    const params = {
      pagina: 1,
      mm: currentMonth,
      yyyy: currentYear,
      nt: card?.NoTarjeta
    }
    get(`/movimientos/inntec`, params).then((response: any) => {
      const movs = response?.data?.movs as IDataIntecTCMov[]
      const M = movs.map((doc, index) => {
        const f = { ...doc, id: `${index}` }
        return f
      })
      setStpData(M)
    }).catch(err => { })
  }

  useEffect(() => {
    card && loadData()
  }, [card]);


  const handleOnView = (card: IDataIntecTC) => {
    setSelectedCard(card)
    setModalView(true);
  }

  const columns = ColumnasMovs({
    onView: handleOnView,
  })

  const handleRowSelection = (state: RowSelectionState) => {
    const selectedRowIds = Object.keys(state);
    if (selectedRowIds.length > 0) {
    }
  };

  useEffect(() => {
    loadData()
  }, [currentYear, currentMonth]);

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
                sorting={[{ id: 'fecha', desc: false }]}
                toolbar={<Toolbar />}
                messages={{ loading: 'Cargando...' }}
                layout={{ card: true }}
              />
            </div>
            <div className="flex flex-col gap-2.5" >
              <div className='flex flex-wrap items-center btn btn-light btn-sm min-w-32'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <span className='flex flex-row gap-2 w-full'>
                      <CustomIcon icon='calendar' className="!size-[0.825rem] text-muted-foreground/90 md" />
                      <span className="text-md">{MESE[currentMonth]?.label || 'Seleciona el mes'}</span>
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {MESE.map((item, inx) => {
                      return (<DropdownMenuItem key={inx} onClick={() => { setCurrentMonth(item.value) }} selected={item.value == currentMonth}>
                        <CustomIcon icon='calendar' className="!size-[0.825rem] text-muted-foreground/90" />
                        <span className="grow">{item.label} </span>
                      </DropdownMenuItem>)
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {currentYear && years.map((year, index) => (
                <span
                  key={index}
                  className={`btn btn-sm ${currentYear == year ? 'btn btn-xs btn-primary' : 'text-gray-600 hover:text-primary '}`}
                  onClick={() => {
                    setCurrentYear(year)
                  }}
                >
                  {year}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TablaMovs };

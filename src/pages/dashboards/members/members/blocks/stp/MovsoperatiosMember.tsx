/* eslint-disable prettier/prettier */
import { useEffect, useMemo, useState } from 'react';
import { Column, ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { DataGrid, DataGridColumnHeader, DataGridRowSelect, DataGridRowSelectAll, CustomIcon, useDataGrid, DataGridColumnVisibility } from '@/components';

import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAPIContext } from '@/auth/useAPIContext';
import { FuncionesIconsOnly } from '@/components/rute/FuncionesIconsOnly';
import { UserType } from '@/types/authTypes';
import { Columnas } from './Columnas';
import { SkeletonTable } from './SkeletonTable';
import { IDataMovStp, TMovTransaction } from '@rute/types';
import { DetalleMovModal } from '@/pages/account/profile/blocks/modals';
import { AccountStatementPDF } from '@/components/rute/AccountStatementPDF';
import { ISaldos } from '@/partials/heros/types';
import { MESE } from '@/utils/Date';

interface MovsoperatiosProps {
  user: UserType,
  saldos:ISaldos
}


const MovsoperatiosMember = ({ user,saldos }: MovsoperatiosProps) => {
  const { get } = useAPIContext();
  const [stpData, setStpData] = useState<IDataMovStp[] | undefined>(undefined);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const years = Array.from({ length: 8 }, (_, i) => 2026 - i);
  const [detalleMovModal, setDetalleMovModal] = useState(false)
  const [transactions, setTransactions] = useState<IDataMovStp[] | undefined>([]);
  const [movDetalle, setMovDetalle] = useState<TMovTransaction | undefined>(undefined);
  const [clientInfo, setClientInfo] = useState<{
    name: string;
    accountNumber: string;
    period: string;
    initialBalance: number;
  } | undefined>(undefined)

  useEffect(() => {
    const params = {
      pagina: 1,
      mm: currentMonth,
      yyyy: currentYear,
      CLABE: user.CLABE
    }
    get(`/member/movs/stp/${user.CLABE}`, params).then((response: any) => {
      const data = response?.data;
      const movs = data?.movs as IDataMovStp[];
      const M = movs.map((doc, index) => {
        return { ...doc, id: `${index}` }
      })
      setClientInfo({
        name: `${user?.NOMBRE} ${user?.APP} ${user?.APM}`,
        accountNumber: user?.CLABE || '??',
        period: `${data?.firstDayOfMonth} - ${data?.lastDayOfMonth}`,
        initialBalance:  saldos?.STP?.saldo||0.0
      })
      setTransactions(M)
      setStpData(M)
    }).catch(err => {
      console.log(err)
    })
  }, [currentYear, currentMonth]);


  const handleOnView = (mov: IDataMovStp) => {
    if (mov?.CVERast) {
      get(`/stp/detalle/${mov?.CVERast}`).then((response: any) => {
        const data = response.data
        if (data && data.operation) {
          setMovDetalle(data.operation);
          setDetalleMovModal(true);
        }
      }).catch(err => { })
    } else {
      setMovDetalle(mov);
      setDetalleMovModal(true);
    }
  }


  const handleRowSelection = (state: RowSelectionState) => {
    const selectedRowIds = Object.keys(state);
    if (selectedRowIds.length > 0) {
    }
  };

  const columns = Columnas({
    onView: handleOnView,
  })

  const Toolbar = () => {
    const { table } = useDataGrid();
    return (
      <div className="card-header border-b-0 px-5 flex-wrap">
        <h3 className="card-title">Movimientos</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <DataGridColumnVisibility table={table} />
          {transactions && clientInfo && <AccountStatementPDF clientInfo={clientInfo} transactions={transactions} />}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-7.5">
      <div className="col-span-3">
        <div className="flex flex-col gap-5 lg:gap-7.5">
          <div className="flex gap-5 lg:gap-7.5">
            <div
              className={`card grow `}
            >
              <DataGrid
                columns={columns}
                data={stpData}
                rowSelection={true}
                onRowSelectionChange={handleRowSelection}
                pagination={{ size: 100 }}
                sorting={[{ id: 'fechCrea', desc: false }]}
                toolbar={<Toolbar />}
                messages={{ loading: <SkeletonTable /> }}
                layout={{ card: true }}
              />
            </div>
            <div className="flex flex-col gap-2.5" >
              <div className='flex flex-wrap items-center btn btn-light btn-sm min-w-32'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <CustomIcon icon='calendar' className="!size-[0.825rem] text-muted-foreground/90" />
                      <span className="text-md">{MESE[currentMonth]?.label || 'Seleciona el mes'}</span>
                    </Button>
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
      <DetalleMovModal title='Detalle del Movimiento' open={detalleMovModal} mov={movDetalle} onCancel={() => { setDetalleMovModal(false) }} />
    </div>
  );

};

export { MovsoperatiosMember };

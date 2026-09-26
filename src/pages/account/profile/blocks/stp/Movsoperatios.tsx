/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import { RowSelectionState } from '@tanstack/react-table';
import { DataGrid, CustomIcon, useDataGrid, DataGridColumnVisibility } from '@/components';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAPIContext } from '@/auth/useAPIContext';
import { Columnas } from './Columnas';
import { AutorizaMovModal, CancelaMovModal, DetalleMovModal } from '../modals';
import { IDataMovStp, TBanco, TMovTransaction } from '@rute/types';
import { AccountStatementPDF } from '@/components/rute/AccountStatementPDF';
import { ISaldos } from '@/partials/heros/types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/contexts/store';
import { loadSaldosAsync } from '@/contexts/store/asyncThunks/apiThunks';
import { UserType } from '@/types';
import { delay } from '@/utils';
import { MESE } from '@/utils/Date';
import { setOpcsBancos } from '@/contexts/store/slicers/appSlice';

interface MovsoperatiosProps { }

const Movsoperatios = ({ }: MovsoperatiosProps) => {
  const { get } = useAPIContext();
  const dispatch = useDispatch<AppDispatch>();
  const saldos = useSelector((state: RootState) => state.app.saldos as ISaldos);
  const user = useSelector((state: RootState) => state.auth.user as UserType);
  const [stpData, setStpData] = useState<IDataMovStp[] | undefined>(undefined);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [detalleMovModal, setDetalleMovModal] = useState(false);
  const [cancelaMovModal, setCancelaMovModal] = useState(false);
  const [autorizaMovModal, setAutorizaMovModal] = useState(false);
  const [selectedMov, setSelectedMov] = useState<IDataMovStp | undefined>(undefined);
  const [transactions, setTransactions] = useState<IDataMovStp[] | undefined>([]);
  const [movDetalle, setMovDetalle] = useState<TMovTransaction | undefined>(undefined);
  const years = Array.from({ length: 8 }, (_, i) => 2026 - i);
  const [clientInfo, setClientInfo] = useState<{
    name: string;
    accountNumber: string;
    period: string;
    initialBalance: number;
  } | undefined>(undefined)

  useEffect(() => {
    loadData()
  }, [saldos])

  const loadBancos = async () => {
    await delay(1000)
    get('/bancos').then((response: any) => {
      const data = response.data;
      const bar = data.map((banco: any) => {
        return {
          ...banco,
          value: banco.clave,
          text: banco.nombre
        }
      });
      dispatch(setOpcsBancos(bar));
    }).catch((err) => { })
  }


  const loadData = async () => {
    await delay(300)
    if (saldos?.STP) {
      const params = {
        pagina: 1,
        mm: currentMonth,
        yyyy: currentYear
      }
      get(`/movimientos/stp`, params).then((response: any) => {
        const data = response?.data;
        const movs = data?.movs as IDataMovStp[];
                console.log(data?.movs,'soy valor de data?.movs')

        const M = movs.map((doc, index) => {
          return { ...doc, id: `${index}` }
        })
        console.log(M,'soy valor de M')

        setClientInfo({
          name: `${user?.NOMBRE} ${user?.APP} ${user?.APM}`,
          accountNumber: user?.CLABE || '??',
          period: `${data?.firstDayOfMonth} - ${data?.lastDayOfMonth}`,
          initialBalance: saldos?.STP?.saldo || 0.00
        })
        setTransactions(M)
        setStpData(M)
      }).catch(err => { });
      loadBancos();
    }
  }

  useEffect(() => {
    loadData()
  }, [currentYear, currentMonth]);

  const handleRowSelection = (state: RowSelectionState) => {
    const selectedRowIds = Object.keys(state);
    if (selectedRowIds.length > 0) { }
  };

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

  const handleOnCancel = (mov: IDataMovStp) => {
    setSelectedMov(mov)
    setCancelaMovModal(true)
  }

  const handleOnAutorize = (mov: IDataMovStp) => {
    setSelectedMov(mov);
    setAutorizaMovModal(true);
  }

  const columns = Columnas({
    onView: handleOnView,
    onCancel: handleOnCancel,
    onAutorize: handleOnAutorize,
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

  const handleResultAuth = (result: any) => {
    setAutorizaMovModal(false);
    loadData();
    dispatch(loadSaldosAsync(get))
  }

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
                sorting={[{ id: 'fechCrea', desc: true }]}
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
      <DetalleMovModal
        title='Detalle del Movimiento'
        open={detalleMovModal}
        mov={movDetalle}
        onCancel={() => { setDetalleMovModal(false) }} />
      <CancelaMovModal title='Cancelar Movimiento' open={cancelaMovModal} data={selectedMov} onResult={() => {
        setCancelaMovModal(false);
        loadData();
      }} onCancel={() => { setCancelaMovModal(false) }} />
      <AutorizaMovModal
        title='Autorizar Movimiento'
        onResult={handleResultAuth}
        open={autorizaMovModal}
        data={selectedMov}
        onCancel={() => { setAutorizaMovModal(false) }} />
    </div>
  );
};

export { Movsoperatios };

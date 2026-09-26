import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataGrid, CustomIcon, useDataGrid, DataGridColumnVisibility } from '@/components';
import { useAPIContext } from '@/auth/useAPIContext';
import { IstpData } from '../cuentas';
import { IDataMovStp, TMovTransaction } from '@rute/types';
import { RowSelectionState } from '@tanstack/react-table';
import { ColumnasMovs } from '../ColumnasMovs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { AccountStatementPDF } from '@/components/rute/AccountStatementPDF';
import { MESE } from '@/utils/Date';
import { Button } from '@/components/ui/button';
import { DetalleMovModal } from './DetalleMovModal';

interface IModalProps {
  open: boolean;
  onOpenChange: () => void;
  account?: IstpData
}

const DelAccountModal = ({ open, onOpenChange, account }: IModalProps) => {
  const { get, post } = useAPIContext();
  const parentRef = useRef<any | null>(null);
  const [clientInfo, setClientInfo] = useState<{
    name: string;
    accountNumber: string;
    period: string;
    initialBalance: number;
  } | undefined>(undefined)

  const [stpData, setStpData] = useState<IDataMovStp[] | undefined>(undefined);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const years = Array.from({ length: 8 }, (_, i) => 2026 - i);
  const [detalleMovModal, setDetalleMovModal] = useState(false)
  const [transactions, setTransactions] = useState<IDataMovStp[] | undefined>([]);
  const [movDetalle, setMovDetalle] = useState<TMovTransaction | undefined>(undefined);
  useEffect(() => {
    if (account) {
      const params = {
        pagina: 1,
        mm: currentMonth,
        yyyy: currentYear,
        CLABE: account.CLABE
      }
      get(`/member/movs/stp/${account.CLABE}`, params).then((response: any) => {
        const data = response?.data;
        const movs = data?.movs as IDataMovStp[];
        const M = movs.map((doc, index) => {
          return { ...doc, id: `${index}` }
        })
        // setClientInfo({
        //   name: `${user?.NOMBRE} ${user?.APP} ${user?.APM}`,
        //   accountNumber: user?.CLABE || '??',
        //   period: `${data?.firstDayOfMonth} - ${data?.lastDayOfMonth}`,
        //   initialBalance: saldos?.STP?.saldo || 0.0
        // })
        setTransactions(M)
        setStpData(M)
      }).catch(err => {
        console.log(err)
      })
    }
  }, [currentYear, currentMonth, account?.CLABE]);

  const handleOnView = (mov: IDataMovStp) => {
    if (mov?.CVERast) {
      get(`/stp/detalle/${mov?.CVERast}`).then((response: any) => {
        const data = response.data
        if (data && data.operation) {
          setMovDetalle(data.operation);
          setDetalleMovModal(true);
        }else{
          setMovDetalle(mov);
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

  const columns = ColumnasMovs({
    onView: handleOnView,
  })

  const Toolbar = () => {
    return (
      <div className="card-header border-b-0 px-5 flex-wrap">
        <div className="flex flex-wrap items-center gap-2.5">
          {transactions && clientInfo && <AccountStatementPDF clientInfo={clientInfo} transactions={transactions} />}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="container-fixed max-w-[auto] flex flex-col p-10 overflow-hidden">
        <DialogHeader className="p-0 border-0">
          <DialogTitle><h3 className="card-title">Estado de la CLABE {account?.CLABE}</h3></DialogTitle>
        </DialogHeader>
        <DialogDescription className="mb-2">
        </DialogDescription>
        <DialogBody className="scrollable-y py-0 mb-5 ps-0 pe-3 -me-7" ref={parentRef}>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-7.5">
            <div className="col-span-3">
              <div className="flex flex-col gap-5 lg:gap-7.5">
                <div className="flex gap-5 lg:gap-7.5">
                  <div className={`card grow `}>
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
                  </div>
                </div>
              </div>
            </div>
            <DetalleMovModal title='Detalle del Movimiento' open={detalleMovModal} mov={movDetalle} onCancel={() => { setDetalleMovModal(false) }} />
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { DelAccountModal };

/* eslint-disable prettier/prettier */
import { useEffect, useMemo, useState } from 'react';
import { Column, RowSelectionState } from '@tanstack/react-table';
import { DataGrid, DataGridColumnVisibility, useDataGrid, CustomIcon } from '@/components';
import { IstpData, SkeletonTable } from '.';
import { toast } from 'sonner';
import { useAPIContext } from '@/auth/useAPIContext';
import { formatearMonedaMXN } from '@/utils/Money';
import { ConciliacionModal } from '../modals/ConciliacionModal';
import { ConfModal } from '../modals/ConfModal';
import { MovimientosModal } from '../modals/MovimientosModal';
import { DelAccountModal } from  '../modals/DelAccountModal';
import { ColumnasAccounts } from '../ColumnasAccounts'; 
import { ConfModalRT } from '../modals/ConfModalRT';
import { SaldoVirtualModal } from '../modals/SaldoVirtualModal';
import { TrasfiereCuentasModal } from '../modals/TrasfiereCuentasModal';
import { LiberaSaldoVirtualModal } from '../modals/LiberaSaldoVirtualModal';
const VITE_IS_RT = import.meta.env.VITE_IS_RT || false;
 
interface ISaldosSTP { 
  "cargosPendientes": number,
  "saldo": number
}
const TablaCuentasSTP = () => {
  const { get, post } = useAPIContext();
  const [stpData, setStpData] = useState<IstpData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOp, setModalOp] = useState(false);
  const [modalMovs, setModalMovs] = useState(false);
  const [modalDel, delModalAccount] = useState(false);
  const [modalConf, setModalConf] = useState(false);
  const [modalTRasfiere, setModalTRasfiere] = useState(false);
  const [modalConfCirtual, setModalConfVirtual] = useState(false);
  const [modalLiberaV, setModalLiberaV] = useState(false);

  const [saldoTotal, setSaldoTotal] = useState<number>(0);
  const [clabe, setClabe] = useState<string | undefined>(undefined);
  const [saldoTotalT, setSaldoTotalT] = useState<number>(0);
  const [saldoRetenido, setSaldoRetenido] = useState<number>(0);
  const [saldoSTPReal, setSaldoSTPReal] = useState<number>(0);
  const [cargosPendientes, setCargosPendientes] = useState<number>(0);
  const [selectedAccount, setSelectedAccount] = useState<any | undefined>(undefined);

  const diferencia = useMemo(
    () => saldoSTPReal - saldoTotalT,
    [saldoTotalT, saldoSTPReal]
  );

  useEffect(() => {
    loadAccounts()
  }, []);

  const getSaldoSTP = () => {
    get('/stp/saldo', { clabe })
      .then((response: any) => {
        if (response && response?.data) {
          const data = response.data as any;
          if (data?.saldo) {
            setSaldoSTPReal(data.saldo);
            setCargosPendientes(data?.cargosPendientes);
          }
        }
      })
      .catch((err) => {
        toast.error(err.message || '[STP] Error al cargar saldos')
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const loadAccounts = () => {
    get('/stp/accounts')
      .then((response: any) => {
        if (response && response.data) {
          const data = response.data as any[];
          let saldoT = 0;
          let saldoR = 0;
          data.map((e) => {
            saldoT += parseFloat(e.saldo);
            saldoR += parseFloat(e.saldoret);
            return { ...e }
          })
          setSaldoTotal(saldoT)
          setSaldoRetenido(saldoR);
          setSaldoTotalT(saldoT + saldoR)
          setStpData(response.data);
        }
      })
      .catch((err) => {
        toast.error(err.message || 'Error al cargar las cuentas')
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const donwload = () => {
    console.log(stpData)
  }

  const handleSelectAccount = (account: any) => {
    setSelectedAccount(account);
    setModalConf(true)
  }
  const handleSelectAddvirtualSaldo = (account: any) => {
    setSelectedAccount(account);
    setModalConfVirtual(true)
  }

  const handleSelectTrasfiere = (account: any) => {
    setSelectedAccount(account);
    setModalTRasfiere(true);
  }

  const handleSelectAccountMovs = (account: any) => {
    setSelectedAccount(account);
    setModalMovs(true)
  }

  const handleSelectLiberaSaldoV = (account: any) => {
    setSelectedAccount(account);
    setModalLiberaV(true)
  }

  const handleDelAccount = (account: any) => {
    setSelectedAccount(account);
    setModalLiberaV(true)
  }
 
  const columns = ColumnasAccounts({
    handleSelectAccount,
    handleSelectAccountMovs,
    handleSelectAddvirtualSaldo,
    handleSelectTrasfiere,
    handleDelAccount,
    handleSelectLiberaSaldoV
  })

  const handleRowSelection = (state: RowSelectionState) => {
    const selectedRowIds = Object.keys(state);
    if (selectedRowIds.length > 0) {
      //Seleccionar solo una fila a la vez y usar setClabe(selected.CLABE)
      toast(`Total ${selectedRowIds.length} are selected.`, {
        description: `Selected row IDs: ${selectedRowIds}`,
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo')
        }
      });
    }
  };

  const Toolbar = () => {
    const { table } = useDataGrid();
    const isFiltered = table.getState().columnFilters.length > 0

    return (
      <div className="card-header border-b-0 px-5 flex-wrap">
        <h3 className="card-title">Cuentas STP</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl shadow-md">
            {/* Saldo total */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">💰 Total:</span>
              <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-800 font-semibold">
                {formatearMonedaMXN(saldoTotal)}
              </span>
            </div>

            {/* Saldo retenido */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">⏸️ Retenido:</span>
              <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-800 font-semibold">
                {formatearMonedaMXN(saldoRetenido)}
              </span>
            </div>

            {/* Saldo STP cargosPendientes */}
            {(saldoSTPReal && cargosPendientes) && <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">🏦 STP (Cargos Pendientes):</span>
              <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-800 font-semibold">
                {formatearMonedaMXN(cargosPendientes)}
              </span>
            </div>}

            {/* Saldo STP */}
            {saldoSTPReal && <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">🏦 STP (Saldo Actual):</span>
              <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-800 font-semibold">
                {formatearMonedaMXN(saldoSTPReal)}
              </span>
            </div>}

            {/* Diferencia */}
            {saldoSTPReal && (diferencia !== 0) && (
              <div onClick={() => { setModalOp(true) }}
                className={`btn btn-light btn-sm flex items-center gap-2 px-3 py-1 rounded-lg font-semibold 
                  ${diferencia > 0 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
              >
                ⚠️ Diferencia: {formatearMonedaMXN(diferencia)}
              </div>
            )}
            <div className="flex items-center gap-2">
              <button className="btn btn-light btn-sm"
                onClick={() => { getSaldoSTP() }}
              >
                <CustomIcon icon="exit-down" />
                Consultar Saldo STP
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-light btn-sm"
                onClick={() => { setModalOp(true) }}
              >
                <CustomIcon icon="exit-down" />
                Consultar Operaciones STP
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button className="btn btn-light btn-sm" onClick={donwload}>
            <CustomIcon icon="exit-down" />
            Descargar Estado
          </button>
          <DataGridColumnVisibility table={table} />
        </div>
      </div>
    );
  };

  if (loading) {
    return <SkeletonTable />;
  }

  const handdleConfig = (refr: boolean) => {
    setModalConf(false);
    if (refr)
      loadAccounts();
  }

  const handleOpe = () => {
    setModalOp(false)
  }
  const handleOpeSaldoVirtual = () => {
    setModalConfVirtual(false)
  }

  return (
    <>
      <DataGrid
        columns={columns}
        columnVisibility={
          {
            LMTMOV: false,
            LMTSAL: false,
            tipo: false
          }
        }
        data={stpData}
        rowSelection={true}
        onRowSelectionChange={handleRowSelection}
        pagination={{ size: 50 }}
        sorting={[{ id: 'CLABE', desc: true }]}
        toolbar={<Toolbar />}
        layout={{
          card: true,
          cellSpacing: 'sm'
        }}

      />
      {stpData && modalOp && <ConciliacionModal clabes={[...stpData, { CLABE: 'ALL' }]} open={modalOp} onOpenChange={handleOpe} />}
      {stpData && modalTRasfiere && <TrasfiereCuentasModal
        clabes={[...stpData]}
        account={selectedAccount}
        open={modalTRasfiere}
        onOpenChange={() => { setModalTRasfiere(false) }} />}

      {stpData && modalLiberaV && <LiberaSaldoVirtualModal open={modalLiberaV} account={selectedAccount} onOpenChange={() => { setModalLiberaV(false) }} />}

      {stpData && modalConfCirtual && <SaldoVirtualModal open={modalConfCirtual} account={selectedAccount} onOpenChange={handleOpeSaldoVirtual} />}
      {VITE_IS_RT && selectedAccount && <ConfModalRT open={modalConf} onOpenChange={handdleConfig} account={selectedAccount} />}
      {!VITE_IS_RT && selectedAccount && <ConfModal open={modalConf} onOpenChange={handdleConfig} account={selectedAccount} />}
      {selectedAccount && <MovimientosModal open={modalMovs} onOpenChange={() => { setModalMovs(false) }} account={selectedAccount} />}
      {selectedAccount && <DelAccountModal open={modalDel} onOpenChange={() => { delModalAccount(false) }} account={selectedAccount} />}
    </>
  );
};

export { TablaCuentasSTP };


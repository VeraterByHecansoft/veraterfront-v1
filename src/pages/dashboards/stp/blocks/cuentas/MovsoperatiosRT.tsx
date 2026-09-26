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
import { ColumnasRt } from './ColumnasRt';
//import { AutorizaMovModal, CancelaMovModal, DetalleMovModal } from '../modals';
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
import { DetalleMovModal } from '../modals/DetalleMovModal';
import { SafeExcelExporter } from '@/components/rute/SafeExcelExporter';
import { SafeExcelExporterRT } from '@/components/rute/SafeExcelExporterRT';
import LoadingOverlay from '@/components/rute/LoadingOverlay';

interface MovsoperatiosProps {
    clavesR?: string[]
    clavesRObjs: any[]
}

const MovsoperatiosRT = ({ clavesR, clavesRObjs }: MovsoperatiosProps) => {
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
    const [movDetalle, setMovDetalle] = useState<TMovTransaction | undefined>(undefined);
    const [isloading, setIsloading] = useState(false);

    useEffect(() => {
        setIsloading(false)
    }, [])

    const loadData = async () => {
        if (!isloading) {
            setIsloading(true)
            const params = {
                pagina: 1,
                mm: currentMonth,
                yyyy: currentYear
            }
            get(`/movimientos/stpall`, params).then((response: any) => {
                const movs = response?.data as IDataMovStp[];
                const M = movs.map((doc, index) => {
                    let esSTP = 'NO';
                    if (clavesR && clavesR.includes(doc.CVERast)) {
                        esSTP = 'SI'
                    }
                    return { ...doc, id: `${index}`, esSTP }
                })
                setStpData(M)
                setIsloading(false)
            }).catch(err => {
                setIsloading(false)
            });
        }
    }

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

    const columns = ColumnasRt({
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

                    <button onClick={loadData}
                        className={`inline-flex items-center justify-center whitespace-nowrap font-medium ring-0 focus:ring-0 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 btn btn-light text-xs btn-sm h-8 rounded-md px-3 gap-1`}>
                        Consultar
                    </button>
                    <div className="">
                        {stpData && stpData.length > 0 && <SafeExcelExporterRT data={stpData} clavesRObjs={clavesRObjs} filename={`movimientos-rt-${new Date().getTime()}`} />}
                    </div>
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
                                data={stpData || []}
                                rowSelection={true}
                                onRowSelectionChange={handleRowSelection}
                                pagination={{ size: 50 }}
                                sorting={[{ id: 'fechCrea', desc: true }]}
                                toolbar={<Toolbar />}
                                //messages={{ loading: 'Cargando...' }}
                                layout={{ card: true }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <DetalleMovModal
                title='Detalle del Movimiento'
                open={detalleMovModal}
                mov={movDetalle}
                onCancel={() => { setDetalleMovModal(false) }} />
            <LoadingOverlay isVisible={isloading} />
            {/*  <CancelaMovModal title='Cancelar Movimiento' open={cancelaMovModal} data={selectedMov} onResult={() => {
        setCancelaMovModal(false);
        loadData();
      }} onCancel={() => { setCancelaMovModal(false) }} />
      <AutorizaMovModal
        title='Autorizar Movimiento'
        onResult={handleResultAuth}
        open={autorizaMovModal}
        data={selectedMov}
        onCancel={() => { setAutorizaMovModal(false) }} />*/}
        </div>
    );
};

export { MovsoperatiosRT };

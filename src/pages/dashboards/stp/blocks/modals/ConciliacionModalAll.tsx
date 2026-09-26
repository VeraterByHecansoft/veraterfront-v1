/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataGrid, CustomIcon, useDataGrid, DataGridColumnVisibility } from '@/components';
import { useAPIContext } from '@/auth/useAPIContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { IstpData } from '../utils/dataModels';
import { IDataConciliaSTP } from '@rute/types';
import { ColumnasMovsConcilia } from '../ColumnasMovsConcilia';
import { formatearMonedaMXN } from '@/utils/Money';
import { SelectorCLABERT } from '@/components/rute/SelectorCLABERT';
import LoadingOverlay from '@/components/rute/LoadingOverlay';
import { SafeExcelExporter } from '@/components/rute/SafeExcelExporter';
interface IModalProfileProps {
  open: boolean;
  onOpenChange: () => void;
  clabes: any[]
}

const ConciliacionModalAll = ({ open, clabes, onOpenChange }: IModalProfileProps) => {
  const { post, get } = useAPIContext();
  const parentRef = useRef<any | null>(null);
  const [clabe, setClabe] = useState<string>('ALL');
  const [selected, setSelected] = useState<any>({ CLABE: 'ALL' });
  const [ingresos, setIngresos] = useState<number>(0);
  const [egresos, setEgresos] = useState<number>(0);
  const [saldo, setSaldo] = useState<number>(0);
  const [stpData, setStpData] = useState<IDataConciliaSTP[] | undefined>([])
  const [detalleMovModal, setDetalleMovModal] = useState(false)
  const divReff = useRef<any | null>(null);
  const [warnings, setWarnings] = useState<any[]>([])
  const [isloading, setIsloading] = useState(false)


  const handdleSelect = (cuenta: any) => {
    setSelected(cuenta)
  }

  const functionconciliaTrans = async (trns: any) => {
    setIsloading(true)
    post(`/stp/conciliacion/trns`, { trns }).then((response: any) => {
      const data = response.data as any
      if (data.success) {
        consultaConcilia();
      }
      setIsloading(false)
      toast.info(data?.message || 'evento desconocido')
    }).catch((error: any) => {
      setIsloading(false)
      toast.error(error.message)
    })
  }
  const actualizarOp = async (trns: any) => {
    setIsloading(true)
    post(`/stp/conciliacion/trnsupdate`, { trns }).then((response: any) => {
      const data = response.data as any
      console.log(data)
      if (data.success) {
        consultaConcilia();
      }
      setIsloading(false)
      toast.info(data?.message || 'evento desconocido')
    }).catch((error: any) => {
      setIsloading(false)
      toast.error(error.message)
    })
  }

  const handleOnView = (mov: IDataConciliaSTP) => {

  }

  const handleOnUpdate = (mov: IDataConciliaSTP) => {
    actualizarOp(mov)
  }

  const handleOnAutorize = (mov: IDataConciliaSTP) => {
    functionconciliaTrans(mov)

  }

  const columns = ColumnasMovsConcilia({
    onView: handleOnView,
    onAutorize: handleOnAutorize,
    onUpdate: handleOnUpdate,
  })

  const consultaConcilia = () => {
    setIsloading(true)
    setWarnings([])
    let url = `/stp/conciliacion/historica/all`
    let params = { clabe: selected?.CLABE }
    post(url, params).then((response: any) => {
      const data = response?.data as any
      const operaciones = data?.operaciones
      const warnings = data?.warnings
      const totales = data?.totales
      if (totales) {
        const ingresos = parseFloat(totales?.ingresos || 0)
        const egresos = parseFloat(totales?.egresos || 0)
        setIngresos(ingresos)
        setEgresos(egresos)
        const saldo = ingresos - egresos;
        setSaldo(saldo)
      }
      if (warnings)
        setWarnings(warnings)
      else
        setWarnings([])

      if (operaciones)
        setStpData(operaciones)

      setIsloading(false)
    }).catch((error: any) => {
      console.log(error);
      setWarnings([{
        message: error.message || error.error || 'Known Error'
      }])
      toast.error(error.message || error.error || 'Known Error')
      setIsloading(false)
    })
  }
  useEffect(() => {
    setStpData([])
    setWarnings([])
  }, [])

  const Toolbar = () => {
    const { table } = useDataGrid();
    return (
      <div className="card-header border-b-0 px-5 flex-wrap">
        <div className="flex flex-wrap items-center gap-2.5">
          <DataGridColumnVisibility table={table} />
          <button onClick={consultaConcilia}
            className={`inline-flex items-center justify-center whitespace-nowrap font-medium ring-0 focus:ring-0 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 btn btn-light text-xs btn-sm h-8 rounded-md px-3 gap-1`}>
            Consultar STP
          </button>
        </div>
      </div>
    );
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="container-fixed min-w-[98%] flex flex-col p-10 overflow-hidden">
        <DialogHeader className="p-0 border-0">
          <DialogTitle>Conciliación</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mb-2">

        </DialogDescription>
        <DialogBody className="scrollable-y scrollable-x py-0 mb-5 ps-0 pe-3 -me-7" ref={parentRef}>
          <div className="mb-4 flex flex-col gap-1">
            <div className="flex flex-row gap-4 relative"> {/* Flex horizontal */}
              {/* Selector de Cuentas */}
              <div className="flex-1 flex flex-col relative" id="selectorcuentas" ref={divReff}>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Cuenta Destino
                </label>
                <SelectorCLABERT
                  dropdownRef={divReff}
                  items={clabes}
                  selected={selected}
                  onSelect={handdleSelect}
                />
              </div>

              {/* Resumen */}
              <div className="flex-1 flex flex-col" id="resumen">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Resumen
                </label>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    Ingresos: {formatearMonedaMXN(ingresos)}
                  </div>
                  <div className="flex items-center gap-2">
                    Egresos:{formatearMonedaMXN(egresos)}
                  </div>
                  <div className="flex items-center gap-2">
                    Saldo STP:{formatearMonedaMXN(saldo)}
                  </div>
                  {selected && selected.saldo && <div className="flex items-center gap-2">
                    Saldo RT:{formatearMonedaMXN(selected.saldo)}
                  </div>}

                </div>
              </div>

              {/* Opciones de Filtrado */}
              <div className="flex-1 flex flex-col" id="opcionesFiltrado">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Acciones
                </label>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  {stpData && stpData.length > 0 && <SafeExcelExporter data={stpData} filename="" />}

                </div>
              </div>

            </div>
          </div>
          <div className="mb-4 flex flex-col gap-1">
            <div className="flex flex-wrap p-2 gap-4">
              {warnings && warnings.length > 0 &&
                warnings.map((warning, idx) => {
                  const fechaStr = warning?.params?.fechaNatural?.toString();
                  let fechaFormatted = 'SERRVER ERROR'
                  if (fechaStr)
                    fechaFormatted = `${fechaStr.slice(0, 4)}-${fechaStr.slice(4, 6)}-${fechaStr.slice(6, 8)}`;

                  return (
                    <div
                      key={idx}
                      className="flex-1 min-w-[200px] max-w-xs bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-sm"
                    >
                      <p className="font-semibold">{warning.mensaje || warning.error || 'Known'}</p>
                      <p className="text-sm text-yellow-800">Fecha: {fechaFormatted}</p>
                    </div>
                  );
                })
              }
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-7.5">
            <div className="col-span-3">
              <div className="flex flex-col gap-5 lg:gap-7.5">
                <div className="flex gap-5 lg:gap-7.5">
                  <div className={`card grow `}  >
                    <DataGrid
                      columns={columns}
                      data={stpData}
                      rowSelection={true}
                      // onRowSelectionChange={handleRowSelection}
                      pagination={{ size: 100 }}
                      sorting={[{ id: 'tsLiquidacion', desc: true }]}
                      toolbar={<Toolbar />}
                      messages={{ loading: 'cargando...' }}
                      layout={{
                        card: true,
                        cellSpacing: 'sm',
                        classes: {
                          container: 'max-h-[300px]'
                        }
                      }}
                      columnVisibility={
                        {
                          idEF: false,
                          empresa: false,
                          claveRastreoDev: false,
                          tipoCuentaOrdenante: false,
                          tipoCuentaBeneficiario: false,
                          rfcCurpOrdenante: false,
                          rfcCurpBeneficiario: false,
                          institucionOperante: false,
                          institucionContraparte: false,
                          nombreCep: false,
                          rfcCep: false,
                          tsCaptura: false,
                          fechaOperacion: false,
                          tipoPago: false,
                          fechaNatural: false
                        }
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <LoadingOverlay isVisible={isloading} />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};





export { ConciliacionModalAll };

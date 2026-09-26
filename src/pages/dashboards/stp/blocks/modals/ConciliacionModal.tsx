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
import { MESE } from '@/utils/Date';
import { IDataConciliaSTP } from '@rute/types';
import { ColumnasMovsConcilia } from '../ColumnasMovsConcilia';
import LoadingOverlay from '@/components/rute/LoadingOverlay';
import { formatearMonedaMXN } from '@/utils/Money';
import { SafeExcelExporter } from '@/components/rute/SafeExcelExporter';
import { SelectorCLABERT } from '@/components/rute/SelectorCLABERT';
import CalendarOps, { ApiResponseCalentar } from '../Calendar';
import Collapsible from '../Collapsible';
import { MovsoperatiosRT } from '../cuentas/MovsoperatiosRT';

interface IModalProfileProps {
  open: boolean;
  onOpenChange: () => void;
  clabes: any[]
}

const ConciliacionModal = ({ open, clabes, onOpenChange }: IModalProfileProps) => {
  const { post } = useAPIContext();
  const parentRef = useRef<any | null>(null);
  const [tipo, setTipo] = useState<string>('mes');
  const [clavesR, setClavesR] = useState<string[]>([]);
  const [clavesRObjs, setClavesRObjs] = useState<any[]>([]);
  const [stpData, setStpData] = useState<IDataConciliaSTP[] | undefined>([]);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [dia, setDia] = useState<number>(-1);
  const [detalleMovModal, setDetalleMovModal] = useState(false)
  const [isloading, setIsloading] = useState(false);
  const [warnings, setWarnings] = useState<any[]>([])
  const [selected, setSelected] = useState<any>({ CLABE: 'ALL' });
  const [ingresos, setIngresos] = useState<number>(0);
  const [egresos, setEgresos] = useState<number>(0);
  const [saldo, setSaldo] = useState<number>(0);
  const [responseCalentar, setResponseCalentar] = useState<ApiResponseCalentar | undefined>(undefined);
  const divReff = useRef<any | null>(null);
  const [activeTab, setActiveTab] = useState("tab1");

  useEffect(() => {
    setStpData([])
    setWarnings([])
    consultastpcop()
  }, [])

  useEffect(() => {
    consultastpcop()
    setStpData([])
  }, [currentMonth]);

  useEffect(() => {
    setWarnings([])
    setStpData([])
  }, [tipo]);

  useEffect(() => {
    if (stpData && stpData.length > 0) {
      const objs: Record<string, {
        idEF?: string;
        urlCEP?: string;
      }>[] = []
      const claves = stpData.map((mv: IDataConciliaSTP) => {
        // Usar claveRastreo como clave dinámica
        const dynamicKey = mv.claveRastreo;

        objs.push({
          [dynamicKey]: {
            idEF: mv.idEF, // o cualquier propiedad de mv que necesites
            urlCEP: mv.urlCEP // o cualquier propiedad de mv que necesites
            // ... otras propiedades que necesites guardar
          }
        });

        return dynamicKey; // ya es string, no necesitas template literal
      });
      setClavesRObjs(objs)
      setClavesR(claves)
    }
  }, [stpData])

  /**
   * Consultar El calendario de operaciones
   */
  const consultastpcop = () => {
    setIsloading(true)
    setWarnings([])
    let url = `/stp/stpcop`
    let params = {
      yyyy: currentYear,
      mm: currentMonth,
    }
    post(url, params).then((response: any) => {
      setResponseCalentar(response)
      setIsloading(false)
    }).catch((error: any) => {
      setResponseCalentar(undefined)
      toast.error(error.message || error.error || 'Known Error')
      setIsloading(false)
    })
  }

  const handdleOnClickDate = (params: { yyyy: string; mm: string; dd: number, force: boolean }) => {
    if (params) {
      setDia(params.dd)
      let _params = {
        yyyy: params.yyyy,
        mm: params.mm,
        dd: params.dd,
        force: params.force,
      }
      callConcilia(_params)
    } else {
      setDia(-1)
      let _params = {
        yyyy: currentYear,
        mm: currentMonth,
        dd: -1,
      }
      callConcilia(_params)
    }
  }

  const callConcilia = (params: any) => {
    setIsloading(true)
    setWarnings([])
    post(`/stp/conciliacion/historica`, params).then((response: any) => {
      const data = response.data as any
      const operaciones = data?.operaciones
      const warnings = data?.warnings
      const totales = data?.totales
      if (operaciones)
        setStpData(operaciones)
      if (warnings)
        setWarnings(warnings)
      else
        setWarnings([])

      if (totales) {
        const ingresos = parseFloat(totales?.ingresos || 0)
        const egresos = parseFloat(totales?.egresos || 0)
        setIngresos(ingresos)
        setEgresos(egresos)
        const saldo = ingresos - egresos;
        setSaldo(saldo)
      }
      setIsloading(false)
      consultastpcop()
    }).catch((error: any) => {
      console.log(error);
      setWarnings([{
        message: error.message || error.error || 'Known Error'
      }])
      toast.error(error.message || error.error || 'Known Error')
      setIsloading(false)
      setStpData([])
      consultastpcop()
    })
  }

  const consultaConciliaYYY = () => {
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

        if (warnings)
          setWarnings(warnings)
        else
          setWarnings([])
      }
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

  /**
   * Agrega transacción STP la base de datos
   * @param trns 
   */
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

  /**
   * Actualiza el estado de una transacción
   * @param trns 
   */
  const actualizarOp = async (trns: any) => {
    setIsloading(true)
    post(`/stp/conciliacion/trnsupdate`, { trns }).then((response: any) => {
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

  const consultaConcilia = () => {
    if (tipo === 'yyyy') {
      consultaConciliaYYY();
    } else {
      const now = new Date();
      let params = {
        yyyy: currentYear,
        mm: now.getMonth(),
        dd: now.getDate()
      }
      if (tipo === 'mes') {
        params = {
          yyyy: currentYear,
          mm: currentMonth,
          dd: dia
        }
      }
      callConcilia(params)
    }
  }

  const handleOnView = (mov: IDataConciliaSTP) => {
    setDetalleMovModal(true);
  }

  const handleOnUpdate = (mov: IDataConciliaSTP) => {
    setDetalleMovModal(true);
    actualizarOp(mov)
  }

  const handdleSelect = (cuenta: any) => {
    setSelected(cuenta)
  }
  const handleOnAutorize = (mov: IDataConciliaSTP) => {
    setDetalleMovModal(true);
    functionconciliaTrans(mov)
  }

  const handdleConsilia = () => {
    if (tipo === 'yyyy') {
      consultaConciliaYYY();
    } else {
      consultaConcilia()
    }
  }

  const columns = ColumnasMovsConcilia({
    onView: handleOnView,
    onAutorize: handleOnAutorize,
    onUpdate: handleOnUpdate
  })

  const Toolbar = () => {
    const { table } = useDataGrid();
    return (
      <div className="card-header border-b-0 px-5 flex-wrap">
        <div className="flex flex-wrap items-center gap-2.5">
          <DataGridColumnVisibility table={table} />
          {tipo !== 'mes' &&
            <button onClick={handdleConsilia}
              className={`inline-flex items-center justify-center whitespace-nowrap font-medium ring-0 focus:ring-0 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 btn btn-light text-xs btn-sm h-8 rounded-md px-3 gap-1`}>
              Consultar
            </button>}
          {stpData && stpData.length > 0 &&
            <SafeExcelExporter data={stpData} filename={`movimientos-stp-${new Date().getTime()}`}/>}
          <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                Ingresos: {formatearMonedaMXN(ingresos)}
              </div>
              <div className="flex items-center gap-2">
                Egresos: {formatearMonedaMXN(egresos)}
              </div>
              <div className="flex items-center gap-2">
                Saldo STP: {formatearMonedaMXN(saldo)}
              </div>
              {selected && selected.saldo && (
                <div className="flex items-center gap-2">
                  Saldo RT: {formatearMonedaMXN(selected.saldo)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="container-fixed min-w-[98%] min-h-[98%] flex flex-col p-10 overflow-hidden">
        <DialogHeader className="p-0 border-0">
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <DialogDescription className="mb-2">
          <div className="flex flex-col">
            <DropdownMenu >
              <DropdownMenuTrigger asChild>
                <span className='btn btn-light btn-sm flex flex-row gap-2 w-full'>
                  <CustomIcon icon='arrow' className="!size-[1rem] text-muted-foreground/90 md" />
                  <span className="text-xl">{tipo === 'yyyy' ? 'Por Año' : tipo === 'mes' ? 'Por mes' : tipo === 'actual' ? 'Dia Actual' : 'Seleciona el Tipo'}</span>
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem key={1} onClick={() => { setTipo('actual') }} selected={'actual' == tipo}>
                  <span className="grow"> actual</span>
                </DropdownMenuItem>
                <DropdownMenuItem key={2} onClick={() => { setTipo('mes') }} selected={'mes' == tipo}>
                  <span className="grow"> Mes</span>
                </DropdownMenuItem>
                <DropdownMenuItem key={3} onClick={() => { setTipo('yyyy') }} selected={'yyyy' == tipo}>
                  <span className="grow"> Año</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DialogDescription>
        <DialogBody className="scrollable-y scrollable-x py-0 mb-5 ps-0 pe-3 -me-7" ref={parentRef}>
          <Collapsible title='Opciones'>
            <div className="grid grid-cols-8 gap-2">

              {(tipo === 'mes') && (
                <>
                  <div className="flex flex-col">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <span className='btn btn-light btn-sm flex flex-row gap-2'>
                          <CustomIcon icon='calendar' className="!size-[0.825rem] text-muted-foreground/90 md" />
                          <span className="text-md">{MESE[currentMonth].label || 'Seleciona el dia'}</span>
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
                </>
              )
              }
            </div>
            {/**
             * Opciones de consulta por mes
             */
              (tipo === 'mes') &&
              <div className="mb-4 flex flex-col gap-2 p-2">
                {responseCalentar && <CalendarOps response={responseCalentar} onClickDate={handdleOnClickDate} />}
              </div>}

            {
              /**
               * Opciones de consulta por aõ
               */
              (tipo === 'yyyy') &&
              <div className="mb-4 flex flex-col gap-2" id="opcionesConsultaYYYY">
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

                  {/* Opciones de Filtrado */}
                  <div className="flex-1 flex flex-col" id="opcionesFiltrado">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Acciones
                    </label>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      {stpData && stpData.length > 0 && <SafeExcelExporter data={stpData} filename={`movimientos-stp-${new Date().getTime()}`} />}

                    </div>
                  </div>
                </div>
              </div>}
            {/**
             * Muestra de warnings
             */
              warnings && warnings.length > 0 &&
              <div className="flex flex-wrap p-2 gap-2">
                {warnings.map((warning, idx) => {
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
              </div>}
          </Collapsible>
          {/* Tabs Header */}
          <div className="grid grid-cols-3 w-full">
            <button
              onClick={() => setActiveTab("tab1")}
              className={`w-full px-4 py-2 font-medium text-sm rounded-t-lg 
      ${activeTab === "tab1"
                  ? "border border-b-0 border-gray-300 text-blue-600"
                  : "bg-gray-100 text-gray-600 hover:text-blue-600"
                }`}
            >
              Consultas STP
            </button>
            <button
              onClick={() => setActiveTab("tab2")}
              className={`w-full px-4 py-2 font-medium text-sm rounded-t-lg 
      ${activeTab === "tab2"
                  ? "border border-b-0 border-gray-300 text-blue-600"
                  : "bg-gray-100 text-gray-600 hover:text-blue-600"
                }`}
            >
              Consultas RUTE
            </button>
          </div>
          {/* Tabs Content */}
          <div className="w-full p-0">
            {activeTab === "tab1" && (
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
                    classes: {
                      container: 'max-h-[auto]'
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
                      fechaNatural: false,
                      tipoPago: false,
                      monto: false
                    }
                  }
                />
              </div>
            )}
            {activeTab === "tab2" && (
              <div>
                <h2 className="text-lg font-semibold">Contenido del Tab 2</h2>
                <MovsoperatiosRT clavesR={clavesR} clavesRObjs={clavesRObjs}/>
              </div>
            )}
          </div>
          <LoadingOverlay isVisible={isloading} />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { ConciliacionModal };

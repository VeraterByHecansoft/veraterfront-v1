import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useResponsive, useViewport } from '@/hooks';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAPIContext } from '@/auth/useAPIContext';
import { TablaMovsOperaciones } from '../tablas/TablaMovsOperaciones';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { CustomIcon } from '@/components';
import { MESE, monthNames } from '@/utils/Date';
interface IModalProfileProps {
  open: boolean;
  onOpenChange: () => void;
}

const ConciliacionModal = ({ open, onOpenChange }: IModalProfileProps) => {
  const { post } = useAPIContext();
  const parentRef = useRef<any | null>(null);

  const [tipo, setTipo] = useState<string>('actual');
  const [mes, setMes] = useState<string>('actual');
  const [rows, setRows] = useState<any[]>([]);


  // valores para los campos dinámicos
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  useEffect(() => {
    if (open) {
      // Reset campos al abrir modal
      setFecha('');
      setHoraInicio('');
      setHoraFin('');
    }
  }, [open]);
  useEffect(()=>{
    if(currentMonth>=0){
      const fechas = generarFechasPorMes(currentMonth);
      console.log(fechas)
    }
  },[currentMonth])


  const consultaConcilia = () => {
    let url = `/stp/conciliacion/actual`
    let params = {

    }
    const fechaFormato = fecha.replace(/-/g, ''); // "2026-08-22" -> "20260822"

    switch (tipo) {
      case 'actual':
        url = `/stp/conciliacion/actual`
        break;
      case 'historica':
        url = `/stp/conciliacion/historica`
        params = {
          "fecha": fechaFormato
        }
        break;
      case 'fechaNatural':
        const horaInicioFormato = horaInicio.replace(/:/g, '') + "00"; // "08:30" -> "083000"P
        const horaFinFormato = horaFin.replace(/:/g, '') + "00"; // "08:30" -> "083000"P
        url = `/stp/conciliacion/fechaNatural`
        params = {
          "fechaNatural": fecha,
          "horaCapturaInicio": horaInicioFormato,
          "horaCapturaFin": horaFinFormato
        }
        break;
      case 'mes':
        url = `/stp/conciliacion/mes`
        params = {
          "mes": mes
        }
        break;
    }

    post(url, params).then((response: any) => {
      const data = response.data as any
      console.log(data)
    }).catch((error: any) => {
      console.log(error)
    })
  }

  function generarFechasPorMes(numeroMes: number) {
    const year = new Date().getFullYear(); // año actual
    const mes = numeroMes+1; // 1 = Enero, 12 = Diciembre
    // obtener cantidad de días del mes
    const diasEnMes = new Date(year, mes, 0).getDate();
    const fechas = [];

    for (let dia = 1; dia <= diasEnMes; dia++) {
      // formatear fecha a AAAAMMDD
      const fechaNatural =
        year.toString() +
        mes.toString().padStart(2, '0') +
        dia.toString().padStart(2, '0');

      fechas.push({
        fechaNatural: parseInt(fechaNatural), // ejemplo: 20260801
        horaCapturaInicio: "00:00:00",
        horaCapturaFin: "23:59:59"
      });
    }

    return fechas;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="container-fixed max-w-[auto] flex flex-col p-10 overflow-hidden">
        <DialogHeader className="p-0 border-0">
          <DialogTitle>Conciliación</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mb-2">
          <div className="grid grid-cols-5 gap-4">
            <div className="flex flex-col">
              <DropdownMenu >
                <DropdownMenuTrigger asChild>
                  <span className='btn btn-light btn-sm flex flex-row gap-2 w-full'>
                    <CustomIcon icon='arrow' className="!size-[1rem] text-muted-foreground/90 md" />
                    <span className="text-xl">{tipo || 'Seleciona el Tipo'}</span>
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem key={1} onClick={() => { setTipo('actual') }} selected={'actual' == tipo}>
                    <span className="grow"> actual</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem key={2} onClick={() => { setTipo('historica') }} selected={'historica' == tipo}>
                    <span className="grow"> historica</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem key={3} onClick={() => { setTipo('fechaNatural') }} selected={'fechaNatural' == tipo}>
                    <span className="grow"> Fecha natural</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem key={4} onClick={() => { setTipo('mes') }} selected={'Mes' == tipo}>
                    <span className="grow"> Mes</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {(tipo === 'mes') && (
              <div className="flex flex-col">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <span className='btn btn-light btn-sm flex flex-row gap-2 w-full'>
                      <CustomIcon icon='calendar' className="!size-[0.825rem] text-muted-foreground/90 md" />
                      <span className="text-md">{MESE[currentMonth].label || 'Seleciona el mes'}</span>
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {MESE.map((item, inx) => {
                      return (<DropdownMenuItem key={inx} onClick={() => { setCurrentMonth(item.value) }} selected={item.value == currentMonth}>
                        <CustomIcon icon='calendar' className="!size-[0.825rem] text-muted-foreground/90" />
                        <span className="grow">{item.label } </span>
                      </DropdownMenuItem>)
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>)}
          </div>
        </DialogDescription>
        <DialogBody className="scrollable-y py-0 mb-5 ps-0 pe-3 -me-7" ref={parentRef}>
          <div className="mb-4 flex flex-col gap-3">
            <div className="grid grid-cols-5 gap-4">
              {(tipo === 'historica' || tipo === 'fechaNatural') && (
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    {tipo === 'historica' ? 'Fecha' : 'Fecha Natural'}
                  </label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>)}

              {tipo === 'fechaNatural' && (
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">Hora Captura Inicio</label>
                  <input
                    type="time"
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {tipo === 'fechaNatural' && (
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">Hora Captura Fin</label>
                  <input
                    type="time"
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex grow gap-5 lg:gap-7.5">
            <div className="flex flex-col items-stretch grow gap-5 lg:gap-7.5">
              <TablaMovsOperaciones movs={rows} />
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { ConciliacionModal };

import { useEffect, useState } from 'react';
import { Button } from '@mui/base';
import { TablaAsignadas, TablaSinAsignadar } from './blocks';
import { ConfigTarjetasModal } from './blocks/modals/ConfigTarjetasModal';
import { SolicitarTarjetasModal } from './blocks/modals/SolicitarTarjetasModal';
import { FondeoMonederoModal } from './blocks/modals/FondeoMonederoModal';
import { TablaSolicitudes } from './blocks/solicitudes';
import { useAPIContext } from '@/auth/useAPIContext';
import { formatearMonedaMXN } from '@/utils/Money';
import { delay } from '@/utils';

const TarjetasPageContent = () => {
  const { get } = useAPIContext();
  const [tabla, setTabla] = useState<number>(1);
  const [saldo, setSaldo] = useState<number>(0);
  const [fondeaM, setFondeaM] = useState(false);
  const [solicita, setSolicita] = useState(false);
  const [settings, setSettings] = useState(false);
  const [monederos, setMonederos] = useState<any[]>([])

  const loadData = async () => {
    await delay(400)
    get(`tarjeta/consulta/monedero`).then((response: any) => {
      const monederos = response?.data as any[]
      setMonederos(monederos)
    }).catch(err => { })
  }



  useEffect(() => {
    if (monederos && monederos.length > 0) {
      let saldo = 0;
      monederos.forEach((m: any) => {
        if (m?.SaldoActual)
          saldo += parseFloat(m?.SaldoActual)
      });
      setSaldo(saldo)
    }
  }, [monederos]);

  const handdleLoad = (status:boolean) => {
    if (status) {
      loadData();
    }

  }
  return (

    <div className="grid gap-5 lg:gap-7.5">

      {/* Botones de selección */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        Saldo Actual Del Monedero: {formatearMonedaMXN(saldo)} ({tabla})
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">

        <button
          onClick={() => { setSolicita(true) }}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Solicitar Tarjetas
        </button>
        {/* <button
          onClick={() => { setSettings(true) }}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Configuración
        </button> 
        <button
          onClick={() => { setFondeaM(true) }}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Fondear Monedero
        </button>*/}
        <Button
          onClick={() => setTabla(1)}
          className={`px-4 py-2 rounded ${tabla === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
        >
          Asignadas
        </Button>
        <Button
          onClick={() => setTabla(2)}
          className={`px-4 py-2 rounded ${tabla === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
        >
          No Asignadas
        </Button>
        <Button
          onClick={() => setTabla(3)}
          className={`px-4 py-2 rounded ${tabla === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
        >
          Solicitudes
        </Button>
      </div>
      {tabla === 1 && <TablaAsignadas onLoaded={handdleLoad} />}
      {tabla === 2 && <TablaSinAsignadar />}
      {tabla === 3 && <TablaSolicitudes />}

      {settings && <ConfigTarjetasModal open={settings} onOpenChange={() => { setSettings(false) }} />}
      {solicita && <SolicitarTarjetasModal open={solicita} onOpenChange={() => { setSolicita(false) }} />}
      {fondeaM && <FondeoMonederoModal open={fondeaM} onOpenChange={() => { setFondeaM(false) }} />}
    </div>
  );
};

export { TarjetasPageContent };

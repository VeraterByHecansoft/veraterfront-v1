import { FormEvent, Fragment, useEffect, useRef, useState } from 'react';

import { Options, IOptionsItems } from './blocks';
import { useAuthContext } from '@/auth';


const SettingsPageContent = () => {
  const items: IOptionsItems = [
    {
      icon: 'Usuarios',
      title: 'Administrar Usuarios y accesos',
      desc: 'Safeguarding your information with strong authentication measures.',
      path: '/members'
    },
    // {
    //   icon: 'cheque',
    //   title: 'Billing & Payments',
    //   desc: 'Simplify payments today with secure, user-friendly transaction processes.',
    //   path: '/settings/billing'
    // },
    // {
    //   icon: 'notification-on',
    //   title: 'Notifications',
    //   desc: 'Keep updated with important notices and event reminders.',
    //   path: '/settings/notifications'
    // },

    // {
    //   icon: 'mouse-square',
    //   title: 'Appearance',
    //   desc: 'Transforming your online presence with flawless appearance.',
    //   path: '/settings/appearance'
    // },

    // {
    //   icon: 'color-swatch',
    //   title: 'Branding',
    //   desc: 'Trending brand designs, identities, and logos.',
    //   path: '/settings/branding'
    // },
    // {
    //   icon: 'chart-line-star',
    //   title: 'Activity',
    //   desc: 'Central Hub for Personal Customization.',
    //   path: '/settings/activity'
    // },
    // {
    //   icon: 'desktop-mobile',
    //   title: 'Devices',
    //   desc: 'Stay ahead with the latest devices and innovations news',
    //   path: '#'
    // },
        // {
    //   icon: 'dropbox',
    //   title: 'Integrations',
    //   desc: 'Enhance Workflows with Advanced Integrations.',
    //   path: '/account/integrations'
    // },
    // {
    //   icon: 'user',
    //   title: 'Members, Teams & Roles',
    //   desc: 'Efficient management of members, teams, and roles.',
    //   path: '/account/members/roles'
    // },
    // {
    //   icon: 'key-square',
    //   title: 'API Keys',
    //   desc: 'Secure and manage Your API Keys effectively and efficiently.',
    //   path: '/account/api-keys'
    // },
  ];

  return (
    <Fragment>
      <Options items={items} dropdown={true} />
      
      <div className="flex grow justify-center pt-5 lg:w-full">
        <ConsolaWSS/>
      </div>

      <div className="flex grow justify-center pt-5 lg:w-full">
        {/* <button  className="btn btn-link">
          Solicitar nuevas funciones
        </button> */}
      </div>
    </Fragment>
  );
};

export { SettingsPageContent };
interface LineaConsola {
  prompt: string;
  comando: string;
}

const ConsolaWSS = ()=>{
  const {user} = useAuthContext();
  const {isOnline} = useAuthContext()
  const [lineas, setLineas] = useState<(LineaConsola | string)[]>([]);
  const [comando, setComando] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const contenedorRef = useRef<HTMLDivElement>(null);

  const manejarComando = (cmd: string) => {
    const nuevaLinea: LineaConsola = { prompt: 'usuario@suma:~$', comando: cmd };
    const respuesta = procesarComando(cmd);
    setLineas((prev) => [...prev, nuevaLinea, ...respuesta]);
    setComando('');
  };

  const procesarComando = (cmd: string): (string | LineaConsola)[] => {
    switch (cmd.toLowerCase()) {
      case 'status':
        return [
          '> API: 🟢 Activa',
          '> Frontend: 🟢 Activo',
          `> ${(isOnline)?'WebSocket: 🟢 Activo':'WebSocket: 🔴 Inactivo'}`,
        ];
      case 'ayuda':
        return ['> Comandos disponibles:', '> ver-status', '> ayuda', '> limpiar'];
      case 'clear':
        setLineas([]);
        return [];
      default:
        return [`> Comando no reconocido: ${cmd}`];
    }
  };

  const manejarSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (comando.trim() !== '') manejarComando(comando.trim());
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    contenedorRef.current?.scrollTo(0, contenedorRef.current.scrollHeight);
  }, [lineas]);

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="bg-black text-green-500 font-mono p-4 rounded-xl shadow-xl w-full max-w-2xl h-96 overflow-y-auto cursor-text"
      ref={contenedorRef}
    >
      {lineas.map((linea, i) =>
        typeof linea === 'string' ? (
          <div key={i}>{linea}</div>
        ) : (
          <div key={i} className="text-white text-sm">
            {linea.prompt} <span className="text-green-500">{linea.comando}</span>
          </div>
        )
      )}

      <form onSubmit={manejarSubmit} className="flex">
        <span className="text-white">{user?.USR}:~{user?.tipo=='admin'?'#':'$'}&nbsp;</span>
        <input
          ref={inputRef}
          type="text"
          value={comando}
          onChange={(e) => setComando(e.target.value)}
          className="bg-transparent outline-none border-none flex-1 text-green-500"
          autoComplete="off"
        />
        {/* <span className="blinking-cursor ml-1 text-green-500">_</span> */}
      </form>
    </div>
  );
}
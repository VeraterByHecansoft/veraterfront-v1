import { useEffect } from 'react';
import useBodyClasses from '@/hooks/useBodyClasses';
import { BasicLayoutProvider, Main } from '.';
import { useSettings } from '@/providers';
import { setModules, useAuthContext } from '@/auth';
import { useLocation } from 'react-router';
import { useOnlyOnChangeWithDebounce } from '@/hooks/useOnlyOnChangeWithDebounce';
import { ModalSessionFinishedMessage } from '@/partials/modals/session-finished-message';
import { SocketProvider } from '@/contexts/socket/SocketProvider';

const modulosAdmin = [
  {
    name: "tarjetas",
    title: "Administración de Tarjetas",
    tooltip: "Administración de Tarjetas",
    description: "Administración de tarjetas asignadas y por asignar",
    path: "/tarjetas",
    icon: "credit-card",
    color: "#F6141F",
    type: "basic",
    active: true,
    children: []
  },
  {
    name: "members",
    title: "Usuarios",
    tooltip: "Administración de usuarios",
    description: "Administración de usuarios, altas, bajas y actualizaciones",
    path: "/members",
    icon: "users",
    color: "#5DADE2",
    type: "basic",
    active: true,
    children: []
  },
  {
    name: "cuentas",
    title: "Cuentas STP",
    tooltip: "Administra las cuentas STP",
    description: "Administra las cuentas STP activas e inactivas",
    path: "/stp/accounts",
    icon: "building-library",
    color: "#5DADE2",
    type: "basic",
    active: true,
    children: []
  },
  {
    name: "Cobros",
    title: "Cobros y cargos recurentes",
    tooltip: "Cobros y cargos recurentes",
    description: "Cobros y cargos recurentes",
    path: "/cobros",
    icon: "building-library",
    color: "#5DADE2",
    type: "basic",
    active: true,
    children: []
  }
]

const BasicLayout = () => {
  const { updateSettings } = useSettings();
  const location = useLocation();
  const path = location.pathname.trim();
  const { user: autUser } = useAuthContext()
  // Aplicar settings solo una vez
  useEffect(() => {
    updateSettings({
      container: 'fluid'
    });
  }, []);

  // Hook para detectar cambios reales en la ruta
  useOnlyOnChangeWithDebounce(() => {
    if ('admin' === autUser?.tipo || 'owner' === autUser?.tipo) {
      setModules(modulosAdmin);
    } else {
      setModules([]);
    }
  }, path);



  // Aplicar clases dinámicas al body
  useBodyClasses(`
    [--tw-page-bg:#E40E20]
    [--tw-page-bg-dark:var(--tw-coal-200)]
    [--tw-text:#FFF]
    [--tw-text-dark:var(--tw-gray-400)]
    [--tw-content-bg:var(--tw-light)]
    [--tw-content-bg-dark:var(--tw-coal-500)]
    [--tw-content-scrollbar-color:#e8e8e8]
    [--tw-header-height:58px] 
    [--tw-sidebar-width:58px]
    [--tw-navbar-height:10px]
    bg-[--tw-page-bg]
    dark:bg-[--tw-page-bg-dark]
    lg:overflow-hidden
    border-[--tw-text]
    dark:border-[--tw-text-dark]
    text-[--tw-text]
    dark:text-[--tw-text-dark]
  `);

  return (
    <SocketProvider>
      <BasicLayoutProvider>
        <Main />
        <ModalSessionFinishedMessage />
      </BasicLayoutProvider>
    </SocketProvider>

  );
};

export { BasicLayout };

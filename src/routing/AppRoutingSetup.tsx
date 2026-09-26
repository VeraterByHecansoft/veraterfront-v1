import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { AuthPage } from '@/auth'; //Rutas de autenticación
import { RequireAuth } from '@/auth/RequireAuth'; //Rutas privadas
import { BasicLayout } from '@/layouts/basic'; //Clasico
import { ErrorsRouting } from '@/errors';// Rutas de errrores 

import {
  AccountProfilePage,
  AccountOverviewPage,
} from '@/pages/account';

import {
  HomeDashboard,
} from '@/pages/dashboards';

import {
  MembersPage
} from '@/pages/dashboards/members';

import {
  MembersAccountPage
} from '@/pages/dashboards/members/members/MembersAccountPage';

import { TarjetasPage } from '@/pages/dashboards/tarjetas/TarjetasPage';

import { AccountsSTPPage } from '@/pages/dashboards/stp';
import { CobrosPage } from '@/pages/dashboards/cobros';
import { DefaultBlankPage } from '@/pages/dashboards/default/DefaultBlankPage';
import { BlankPage } from '@/pages/dashboards/blank';


const AppRoutingSetup = (): ReactElement => {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<BasicLayout />}>
          <Route path="/" element={<Navigate to="/account/profile" replace />} />
          <Route path="/account" element={<Navigate to="/account/profile" replace />} />
          <Route path="/account/security/overview" element={<AccountOverviewPage />} />
          <Route path="/panel" element={<HomeDashboard />} />
          <Route path="/account/profile" element={<AccountProfilePage />} />
          <Route path="/tarjetas" element={<TarjetasPage />} />
          <Route path="/stp/accounts" element={<AccountsSTPPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/cobros" element={<CobrosPage />} />
          <Route path="/member/:id" element={<MembersAccountPage />} />
          <Route path="/pay/acept" element={<BlankPage title='Pago Aceptado' />} />
          <Route path="/pay/cancel" element={<BlankPage title='Pago Cancelado' />} />
        </Route>
      </Route>
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export { AppRoutingSetup };

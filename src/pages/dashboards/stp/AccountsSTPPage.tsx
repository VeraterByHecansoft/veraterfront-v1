import { Fragment } from 'react';

import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';

import { AccountsSTPPageContent } from '.';
import { useLayout } from '@/providers';
import { useAuthContext } from '@/auth';
import { Navigate } from 'react-router';

const AccountsSTPPage = () => {
  const { user } = useAuthContext()
  const { currentLayout } = useLayout();
  if (!['admin', 'owner'].includes(`${user?.tipo}`)) {
    return <Navigate to="/panel" replace />;
  }
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>Cuentas STP</ToolbarDescription>
          </ToolbarHeading>
        </Toolbar>
      </Container>
      <Container>
        <AccountsSTPPageContent />
      </Container>
    </Fragment>
  );
};

export { AccountsSTPPage };

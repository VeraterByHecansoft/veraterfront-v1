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
import { TarjetasPageContent } from './TarjetasPageContent';
import { useAuthContext } from '@/auth';
import { Navigate } from 'react-router';

const TarjetasPage = () => {
  const { user } = useAuthContext()
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
            <ToolbarDescription>Tarjetas</ToolbarDescription>
          </ToolbarHeading>
          {/* <ToolbarActions>
          </ToolbarActions> */}
        </Toolbar>
      </Container>
      <Container>
        <TarjetasPageContent />
      </Container>
    </Fragment>
  );
};

export { TarjetasPage };

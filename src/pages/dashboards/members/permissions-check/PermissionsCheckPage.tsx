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

import { PermissionsCheckContent } from '.';
import { useLayout } from '@/providers';
import { Link } from 'react-router-dom';

const PermissionsCheckPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      <PageNavbar />
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Overview of all team members and roles.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
            <Link to="/members/permision" className="btn btn-sm btn-light">
                Nuevo Permiso
              </Link>
              <Link to="/members/roles" className="btn btn-sm btn-light">
                View Roles
              </Link>
            </ToolbarActions>
          </Toolbar>
        </Container>


      <Container>
        <PermissionsCheckContent />
      </Container>
    </Fragment>
  );
};

export { PermissionsCheckPage };

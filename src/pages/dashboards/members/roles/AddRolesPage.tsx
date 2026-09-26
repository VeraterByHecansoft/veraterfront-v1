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

import { AddRolesContent } from '.';
import { useLayout } from '@/providers';
import { Link } from 'react-router-dom';

const AddRolesPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>Agregar Un nuevo Rol</ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <Link to={`/members/roles`} className="btn btn-sm btn-light">
              Todos los roles
            </Link>
          </ToolbarActions>
        </Toolbar>
      </Container>
      {/* {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Overview of all team members and roles.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                New Role
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )} */}

      <Container>
        <AddRolesContent />
      </Container>
    </Fragment>
  );
};

export { AddRolesPage };

import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';

import { RolesPageContent } from '.';

const RolesPage = () => {

  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>Descripción general de todos los miembros y roles del equipo.</ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <Link to={`/members/permision`} className="btn btn-sm btn-light">
              Crear un Permiso para un rol
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
        <RolesPageContent />
      </Container>
    </Fragment>
  );
};

export { RolesPage };

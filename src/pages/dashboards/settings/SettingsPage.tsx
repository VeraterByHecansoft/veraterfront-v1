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
import { SettingsPageContent } from '.';
import { useLayout } from '@/providers';
import { Link } from 'react-router-dom';
import { useAuthContext } from '@/auth';

const SettingsPage = () => {
  const { currentLayout } = useLayout();
  const {user } = useAuthContext()
  return (
    <Fragment>
      <PageNavbar />

        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="text-gray-800 font-medium">{user?.NOMBRE} {user?.APP} {user?.APM}</span>
                  <a
                    href="mailto:jaytatum@ktstudio.com"
                    className="text-gray-700 hover:text-primary"
                  >
                    {user?.email}
                  </a>
                  <span className="size-0.75 bg-gray-600 rounded-full"></span>
                  <Link to="/account/profile" className="font-semibold btn btn-link link">
                    Configuración personal
                  </Link>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
          </Toolbar>
        </Container>

      <Container>
        <SettingsPageContent />
      </Container>
    </Fragment>
  );
};

export { SettingsPage };

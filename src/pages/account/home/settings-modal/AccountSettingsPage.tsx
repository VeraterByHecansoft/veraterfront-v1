import { Fragment, useState } from 'react';

import { toAbsoluteUrl } from '@/utils/Assets';
import { CustomIcon } from '@/components';
import { Container } from '@/components/container';

import { Navbar, NavbarActions, NavbarDropdown } from '@/partials/navbar';
import { PageMenu } from '@/pages/public/profile';
import { AccountSettingsAdminModal } from './AccountSettingsAdminModal';
import { useLocation, useNavigate } from 'react-router';

const AccountSettingsPage = () => {
  const [settingsModalOpen, setSettingsModalOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

  const handleSettingsModalClose = () => {
    navigate(from);
    setSettingsModalOpen(false);
  };

  const image = (
    <img
      src={toAbsoluteUrl('/media/avatars/300-1.png')}
      className="rounded-full border-3 border-success max-h-[100px] max-w-full"
    />
  );

  return (
    <Fragment>
      <Container>
        <Navbar>
          <PageMenu />

          <NavbarActions>
            <button type="button" className="btn btn-sm btn-primary">
              <CustomIcon icon="users" /> Connect
            </button>
            <button className="btn btn-sm btn-icon btn-light">
              <CustomIcon icon="messages" />
            </button>
            <NavbarDropdown />
          </NavbarActions>
        </Navbar>
      </Container>

      <Container>
        <AccountSettingsAdminModal open={true} onOpenChange={handleSettingsModalClose} />
      </Container>
    </Fragment>
  );
};

export { AccountSettingsPage };

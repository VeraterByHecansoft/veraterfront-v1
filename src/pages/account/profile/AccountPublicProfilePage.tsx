import { Fragment, useEffect, useState } from 'react';
import { CustomIcon } from '@/components';
import { Container } from '@/components/container';
import { Navbar, NavbarActions } from '@/partials/navbar';
import { PageMenu } from '@/pages/public/profile';
import { AccountProfilePageContent } from './AccountProfilePageContent';


const AccountPublicProfilePage = () => {
  return (
    <Fragment>
      <Container>
        <Navbar>
          <PageMenu />
          <NavbarActions>
            <button className="btn btn-sm btn-icon btn-light">
              <CustomIcon icon="messages" />
            </button>
          </NavbarActions>
        </Navbar>
      </Container>
      <Container>
        <AccountProfilePageContent/>
      </Container>
    </Fragment>
  );
};

export { AccountPublicProfilePage };

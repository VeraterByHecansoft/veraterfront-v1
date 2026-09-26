import { Fragment } from 'react';

import { toAbsoluteUrl } from '@/utils/Assets';
import { CustomIcon } from '@/components';
import { Container } from '@/components/container';

import { UserProfileHero } from '@/partials/heros';
import { Navbar, NavbarActions, NavbarDropdown } from '@/partials/navbar';
import { PageMenu } from '@/pages/public/profile';

import { ProfileCreatorContent } from '.';

const ProfileCreatorPage = () => {
  const image = (
    <div className="flex items-center justify-center rounded-full border-2 border-danger-clarity bg-light size-[100px] shrink-0">
      <img src={toAbsoluteUrl('/media/brand-logos/inferno.svg')} className="size-11" />
    </div>
  );

  return (
    <Fragment>
      <UserProfileHero
        name="Inferno"
        image={image}
        info={[
          { label: 'inferno.com', icon: 'abstract-39' },
          { label: 'SF, Bay Area', icon: 'geolocation' },
          { email: 'jenny@kteam.com', icon: 'sms' }
        ]}
        saldos={undefined}
      />

      <Container>
        <Navbar>
          <PageMenu />

          <NavbarActions>
            <a href="#" className="btn btn-sm btn-primary">
              <CustomIcon icon="mouse-square" /> Hire Us
            </a>
            <button type="button" className="btn btn-sm btn-light">
              <CustomIcon icon="users" /> Follow
            </button>
            <button className="btn btn-sm btn-icon btn-light">
              <CustomIcon icon="messages" />
            </button>
            <NavbarDropdown />
          </NavbarActions>
        </Navbar>
      </Container>

      <Container>
        <ProfileCreatorContent />
      </Container>
    </Fragment>
  );
};

export { ProfileCreatorPage };

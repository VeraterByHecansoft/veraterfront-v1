import { Fragment, useEffect } from 'react';
import { toAbsoluteUrl } from '@/utils/Assets';
import { Container, LoadingScreen } from "@/components";
import { UserProfileHero } from '@/partials/heros';
import { Navbar } from '@/partials/navbar';
import { PageMenu } from '@/pages/public/profile';
import { AccountProfilePageContent } from './AccountProfilePageContent';
import { UserType } from '@/types/authTypes';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/contexts/store';
import { loadSaldosAsync } from '@/contexts/store/asyncThunks/apiThunks';
import { ISaldos } from '@/partials/heros/types';
import { useAPIContext } from '@/auth/useAPIContext';

const AccountProfilePage = () => {
  const { get } = useAPIContext();
  const saldos = useSelector((state: RootState) => state.app.saldos as ISaldos);
  const user = useSelector((state: RootState) => state.auth.user as UserType);
  const dispatch = useDispatch<AppDispatch>();

  if (!user) {
    return <LoadingScreen />;
  }

  useEffect(() => {
    dispatch(loadSaldosAsync(get))
  }, [])

  const avatar = user?.imgperf ? `https://rute.mx/D?u=${user.imgperf}&t=1` : toAbsoluteUrl(`/media/avatars/${'blank.png'}`)
  const image = (
    <img
      src={avatar}
      className="rounded-full border-3 border-success size-[100px] shrink-0"
    />
  );

  return (
    <Fragment>
      <UserProfileHero
        name={`${user?.NOMBRE}`}
        image={image}
        info={[
          { label: `${user?.APP} ${user?.APM} (${user.tipo})`, icon: 'user' },
          { label: user?.cel, icon: 'phone' },
          { email: user?.email, icon: 'at-symbol' },
        ]}
        saldos={saldos}
      />
      <Container>
        <Navbar>
          <PageMenu />
        </Navbar>
      </Container>
      <Container>
        <AccountProfilePageContent />
      </Container>
    </Fragment>
  );
};

export { AccountProfilePage };

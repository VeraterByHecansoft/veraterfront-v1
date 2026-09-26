import { Container } from '@/components/container';

import { useAuthContext } from '@/auth';
import { HomeContent } from './HomeContent';

const HomePage = () => {
  const {user} = useAuthContext();

  return (
    <Container>
     <HomeContent />;
    </Container>
  );
};

export { HomePage };

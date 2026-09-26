import { Container } from '@/components/container';
import { HomeContent } from '.';
import { useAuthContext } from '@/auth';

const HomeDashboard = () => {
  const {user} = useAuthContext();
  const role = user?.tipo
  const render =  () =>{
    {
      switch(role){
        case 'admin':
        return <HomeContent />;
        default:
        return <HomeContent />;
      }
    }
  }

  return (
    <Container>
     {render()}
    </Container>
  );
};

export { HomeDashboard };

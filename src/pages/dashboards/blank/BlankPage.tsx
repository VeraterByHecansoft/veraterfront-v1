import { Container } from '@/components/container';
import { BlankContent } from '.';

interface BlankPageProps{
  title?:string
}
const BlankPage = ({title="sin titulo"}:BlankPageProps) => {
  return (
    <Container>
      {title &&<h2>{title}</h2>}

    </Container>
  );
};

export { BlankPage };

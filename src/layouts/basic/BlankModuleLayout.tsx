import { PropsWithChildren } from "react";
import { Container } from '@/components/container';
import { Navbar } from '@/partials/navbar';
import { PageMenu } from '@/pages/public/profile';

const BlankModuleLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="lg:col-span-1">
        <div className="grid md:grid-cols-2 gap-5 lg:gap-7.5 h-full items-stretch">
          <Container>
            <Navbar>
              <PageMenu />
            </Navbar>
          </Container>
        </div>
      </div>
      <div className="flex grow justify-center pt-5 lg:pt-7.5">
        { children }
      </div>
    </div>
  );
}

export default BlankModuleLayout
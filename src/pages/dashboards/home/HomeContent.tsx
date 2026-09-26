import {  ModuleOptions } from './blocks';
import SolicitarMasFunciones from '@/components/rute/SolicitarMasFunciones';

const HomeContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="lg:col-span-1">
        <div className="grid md:grid-cols-3 gap-5 lg:gap-7.5 h-full items-stretch">
          <ModuleOptions />
        </div>
      </div>
      <SolicitarMasFunciones/>
    </div>
  );
};

export { HomeContent };

import { BlockList, ReportSettings } from '@/pages/account/security/privacy-settings';
import { EntryCallout, Teams } from '@/pages/dashboards/blocks';


import { ManageData } from '../home/blocks';
import Summary from './blocks/Summary';
// import { ManageData } from './blocks';

const WarehousesPageContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-2">
          <Summary />
        </div>

        <div className="lg:col-span-1">
          <ManageData className="h-full" />
        </div>
      </div>
    </div>
  );
};

export { WarehousesPageContent };

import { MiscFaq, MiscHelp2 } from '@/partials/misc';

import { Members, PermissionsToggle, IPermissionsToggle } from './blocks';
import { PermissionsToggleNew } from './blocks/PermissionsToggleNew';
import { PermissionsToggleEdit } from './blocks/PermissionsToggleEdit';

const AccountPermissionsEditContent = ({permision}:any) => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
     {permision&& (<PermissionsToggleEdit permision={permision} />)} 

      {/* <Members title="Team Members" /> */}

      {/* <MiscFaq /> */}

      {/* <MiscHelp2 /> */}
    </div>
  );
};

export { AccountPermissionsEditContent };

import { MiscFaq, MiscHelp2 } from '@/partials/misc';

import { Members, PermissionsToggle, IPermissionsToggle } from './blocks';
import { PermissionsToggleNew } from './blocks/PermissionsToggleNew';

const AccountPermissionsNewContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <PermissionsToggleNew />

      {/* <Members title="Team Members" /> */}

      {/* <MiscFaq /> */}

      {/* <MiscHelp2 /> */}
    </div>
  );
};

export { AccountPermissionsNewContent };

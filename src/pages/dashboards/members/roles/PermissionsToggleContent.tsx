import { MiscFaq, MiscHelp2 } from '@/partials/misc';

import { Members, PermissionsToggle, IPermissionsToggle } from '../permissions-toggle/blocks';

interface AccountPermissionsToggleContentProps {
  role:IPermissionsToggle;
}

const PermissionsToggleContent = ({role}:AccountPermissionsToggleContentProps) => {
  console.log(role)
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <PermissionsToggle role={role}/>

      {/* <Members title="Team Members" /> */}

      {/* <MiscFaq /> */}

      {/* <MiscHelp2 /> */}
    </div>
  );
};

export { PermissionsToggleContent };

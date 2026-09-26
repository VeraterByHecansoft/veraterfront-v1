import { CustomIcon, MenuIcon, MenuItem, MenuLink, MenuSub, MenuTitle } from '@/components';

const DropdownCard2 = () => {
  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
      <MenuItem path="/account/home/settings-enterprise">
        <MenuLink>
          <MenuIcon>
            <CustomIcon icon="setting-3" />
          </MenuIcon>
          <MenuTitle>Settings</MenuTitle>
        </MenuLink>
      </MenuItem>
      <MenuItem path="/account/members/import-members">
        <MenuLink>
          <MenuIcon>
            <CustomIcon icon="some-files" />
          </MenuIcon>
          <MenuTitle>Import</MenuTitle>
        </MenuLink>
      </MenuItem>
      <MenuItem path="/account/activity">
        <MenuLink>
          <MenuIcon>
            <CustomIcon icon="cloud-change" />
          </MenuIcon>
          <MenuTitle>Activity</MenuTitle>
        </MenuLink>
      </MenuItem>
      <MenuItem path="#">
        <MenuLink>
          <MenuIcon>
            <CustomIcon icon="dislike" />
          </MenuIcon>
          <MenuTitle>Report</MenuTitle>
        </MenuLink>
      </MenuItem>
    </MenuSub>
  );
};

export { DropdownCard2 };

import {
  CustomIcon,
  MenuArrow,
  MenuIcon,
  MenuItem,
  MenuLink,
  MenuSub,
  MenuTitle
} from '@/components';
import { useLanguage } from '@/i18n';

const DropdownCrud1 = () => {
  const { isRTL } = useLanguage();

  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[175px]">
      <MenuItem path="/account/home/settings-plain">
        <MenuLink>
          <MenuIcon>
            <CustomIcon icon="add-files" />
          </MenuIcon>
          <MenuTitle>Add</MenuTitle>
        </MenuLink>
      </MenuItem>
      <MenuItem path="/account/members/import-members">
        <MenuLink>
          <MenuIcon>
            <CustomIcon icon="file-down" />
          </MenuIcon>
          <MenuTitle>Import</MenuTitle>
        </MenuLink>
      </MenuItem>
      <MenuItem
        toggle="dropdown"
        trigger="hover"
        dropdownProps={{
          placement: isRTL() ? 'left-start' : 'right-start',
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: isRTL() ? [15, 0] : [-15, 0] // [skid, distance]
              }
            }
          ]
        }}
      >
        <MenuLink>
          <MenuIcon>
            <CustomIcon icon="file-up" />
          </MenuIcon>
          <MenuTitle>Export</MenuTitle>
          <MenuArrow>
            <CustomIcon icon="right" className="text-3xs rtl:transform rtl:rotate-180" />
          </MenuArrow>
        </MenuLink>
        <MenuSub className="menu-default" rootClassName="w-full max-w-[125px]">
          <MenuItem path="/account/home/settings-sidebar">
            <MenuLink>
              <MenuTitle>PDF</MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuItem path="/account/home/settings-sidebar">
            <MenuLink>
              <MenuTitle>CVS</MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuItem path="/account/home/settings-sidebar">
            <MenuLink>
              <MenuTitle>Excel</MenuTitle>
            </MenuLink>
          </MenuItem>
        </MenuSub>
      </MenuItem>
      <MenuItem path="/account/security/privacy-settings">
        <MenuLink>
          <MenuIcon>
            <CustomIcon icon="setting-3" />
          </MenuIcon>
          <MenuTitle>Settings</MenuTitle>
        </MenuLink>
      </MenuItem>
    </MenuSub>
  );
};

export { DropdownCrud1 };

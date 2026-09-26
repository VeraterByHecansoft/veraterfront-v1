import { CustomIcon, MenuIcon, MenuItem, MenuLink, MenuSub, MenuTitle } from '@/components';

const DropdownCardItem1 = () => {
  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[175px]">
      <MenuItem path="#">
        <MenuLink>
          <MenuIcon>
            <CustomIcon icon="document" />
          </MenuIcon>
          <MenuTitle>Details</MenuTitle>
        </MenuLink>
      </MenuItem>
      <MenuItem path="#">
        <MenuLink>
          <MenuIcon>
            <CustomIcon icon="share" />
          </MenuIcon>
          <MenuTitle>Share</MenuTitle>
        </MenuLink>
      </MenuItem>
      <MenuItem path="#">
        <MenuLink>
          <MenuIcon>
            <CustomIcon icon="file-up" />
          </MenuIcon>
          <MenuTitle>Export</MenuTitle>
        </MenuLink>
      </MenuItem>
    </MenuSub>
  );
};

export { DropdownCardItem1 };

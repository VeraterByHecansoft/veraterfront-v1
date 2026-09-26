import { CustomIcon, MenuIcon, MenuItem, MenuLink, MenuSub, MenuTitle } from '@/components';

interface DropdownRolesProps {
  onEdit:()=>void, 
  onDetails:()=>void, 
  onExport:()=>void, 
}

const DropdownCardItemRole: React.FC<DropdownRolesProps> = ({ onEdit, onDetails, onExport }) => {
  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[175px]">
      <MenuItem onClick={onDetails}>
        <MenuLink >
          <MenuIcon>
            <CustomIcon icon="document" />
          </MenuIcon>
          <MenuTitle>Detalles</MenuTitle>
        </MenuLink>
      </MenuItem>
      <MenuItem onClick={onEdit}>
        <MenuLink>
          <MenuIcon>
            <CustomIcon icon="share" />
          </MenuIcon>
          <MenuTitle>Editar</MenuTitle>
        </MenuLink>
      </MenuItem>
      <MenuItem onClick={onExport}>
        <MenuLink>
          <MenuIcon>
            <CustomIcon icon="file-up" />
          </MenuIcon>
          <MenuTitle>Exportar</MenuTitle>
        </MenuLink>
      </MenuItem>
    </MenuSub>
  );
};

export { DropdownCardItemRole };

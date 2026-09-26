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

const DropdownUserMedatada = () => {
  const { isRTL } = useLanguage();


  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[175px]">
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
            <CustomIcon icon="setting-3" />
          </MenuIcon>
          <MenuTitle>Settings</MenuTitle>
          <MenuArrow>
            <CustomIcon icon="right" className="text-3xs rtl:transform rtl:rotate-180" />
          </MenuArrow>
        </MenuLink>
        <MenuSub className="menu-default" rootClassName="w-full max-w-[125px]">
        <MenuItem path="/account/settings">
            <MenuLink>
              <MenuTitle>Configuración</MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuItem path="/account/notifications">
            <MenuLink>
              <MenuTitle>Notificaciones</MenuTitle>
            </MenuLink>
          </MenuItem>

          <MenuItem path="/account/integrations">
            <MenuLink>
              <MenuTitle>Integraciones</MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuItem path="/account/members/roles">
            <MenuLink>
              <MenuTitle>Miembros y roles</MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuItem path="/account/api-keys">
            <MenuLink>
              <MenuTitle>API Keys</MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuItem path="/account/appearance">
            <MenuLink>
              <MenuTitle>Apariencia</MenuTitle>
            </MenuLink>
          </MenuItem>
        
          
          <MenuItem path="/account/security/overview">
            <MenuLink>
              <MenuTitle>Seguridad</MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuItem path="/account/activity">
            <MenuLink>
              <MenuTitle>Historial de actividades</MenuTitle>
            </MenuLink>
          </MenuItem>
        </MenuSub>
      </MenuItem>
      <MenuItem path="/account/members/team-info">
        <MenuLink>
          <MenuIcon>
            <CustomIcon icon="edit" />
          </MenuIcon>
          <MenuTitle>Editar</MenuTitle>
        </MenuLink>
      </MenuItem>
    </MenuSub>
  );
};

export { DropdownUserMedatada };

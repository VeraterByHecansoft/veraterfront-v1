import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomIcon } from '@/components/custom-icons';
import { toAbsoluteUrl } from '@/utils';
import { Menu, MenuItem, MenuToggle } from '@/components';
import { DropdownUser } from '@/partials/dropdowns/user';
import { ModalSearch } from '@/partials/modals/search/ModalSearch';
import { DropdownNotifications } from '@/partials/dropdowns/notifications';
import { DropdownApps } from '@/partials/dropdowns/apps';
import { DropdownChat } from '@/partials/dropdowns/chat';
import { useLanguage } from '@/i18n';
import { useAuthContext } from '@/auth';

const HeaderTopbar = () => {
  const itemAppsRef = useRef<any>(null);
  const itemChatRef = useRef<any>(null);
  const itemUserRef = useRef<any>(null);
  const { user } = useAuthContext();
  const itemNotificationsRef = useRef<any>(null);
  
  const { isRTL } = useLanguage();

  const handleDropdownChatShow = () => {
    window.dispatchEvent(new Event('resize'));
  };

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const handleSearchModalOpen = () => setSearchModalOpen(true);
  const handleSearchModalClose = () => {
    setSearchModalOpen(false);
  };

  return (
    <div className="flex items-center lg:gap-3.5">
      <div className="flex items-center gap-1.5">
      </div>
      <Menu>
        <MenuItem
          ref={itemUserRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 9] // [skid, distance]
                }
              }
            ]
          }}
        >
          <MenuToggle className="btn btn-icon rounded-full">
            <img
              className="size-8 rounded-full justify-center border border-gray-500 shrink-0"
              src={toAbsoluteUrl(`/media/avatars/${'blank.png'}`)}
              alt=""
            />
          </MenuToggle>
          {DropdownUser({ menuItemRef: itemUserRef })}
        </MenuItem>
      </Menu>
    </div>
  );
};

export { HeaderTopbar };

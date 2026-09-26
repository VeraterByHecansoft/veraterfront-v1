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
import { Icon } from '@iconify/react';
import { useTimer } from '@/contexts/timer/TimerContext';

const HeaderTopbar = () => {
  const { elapsedTime, formattedTime } = useTimer()
  const { user } = useAuthContext()
  const itemUserRef = useRef<any>(null);
  const { isOnline } = useAuthContext();
  const { isRTL } = useLanguage();
  const itemAppsRef = useRef<any>(null);
  const itemChatRef = useRef<any>(null);
  const itemNotificationsRef = useRef<any>(null);

  const avatar = user?.imgperf ? `https://rute.mx/D?u=${user.imgperf}&t=1` : toAbsoluteUrl(`/media/avatars/${'blank.png'}`)

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
      {/* <Link to={'/account/setting'} className="btn btn-xs btn-primary me-1 sm:me-0">
        Get Started
      </Link> */}

      <div className="flex items-center gap-1.5">
        <small>{formattedTime}</small>
        {/* <button
          onClick={handleSearchModalOpen}
          className="btn btn-icon btn-icon-lg size-8 text-gray-600 hover:text-primary"
        >
          <Icon icon="heroicons-outline:home" className="w-6 h-6" />
        </button> */}
        {/* <ModalSearch open={searchModalOpen} onOpenChange={handleSearchModalClose} /> */}

        <Menu>
          <MenuItem
            ref={itemNotificationsRef}
            toggle="dropdown"
            trigger="click"
            dropdownProps={{
              placement: isRTL() ? 'bottom-start' : 'bottom-end',
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [10, 10] // [skid, distance]
                  }
                }
              ]
            }}
          >
            <MenuToggle className="btn btn-icon btn-icon-lg size-8 text-gray-600 hover:text-primary [dropdown-open:text-primary">
              <Icon icon="heroicons-outline:bell" className="w-6 h-6" />
            </MenuToggle>
            {DropdownNotifications({ menuTtemRef: itemNotificationsRef })}
          </MenuItem>
        </Menu>

        {/* <Menu>
          <MenuItem
            ref={itemChatRef}
            onShow={handleDropdownChatShow}
            toggle="dropdown"
            trigger="click"
            dropdownProps={{
              placement: isRTL() ? 'bottom-start' : 'bottom-end',
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [10, 10] // [skid, distance]
                  }
                }
              ]
            }}
          >
            <MenuToggle className="btn btn-icon btn-icon-lg size-8 text-gray-600 hover:text-primary [dropdown-open:text-primary">
              <Icon icon="heroicons-outline:chat-bubble-left" className="w-6 h-6" />
            </MenuToggle>
            {DropdownChat({ menuTtemRef: itemChatRef })}
          </MenuItem>
        </Menu> */}

        {/* <Menu>
          <MenuItem
            ref={itemAppsRef}
            toggle="dropdown"
            trigger="click"
            dropdownProps={{
              placement: isRTL() ? 'bottom-start' : 'bottom-end',
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [10, 10] // [skid, distance]
                  }
                }
              ]
            }}
          >
            <MenuToggle className="btn btn-icon btn-icon-lg size-8 text-gray-600 hover:text-primary [dropdown-open:text-primary">
              <Icon icon="heroicons-outline:adjustments-vertical" className="w-6 h-6" />
            </MenuToggle>
            {DropdownApps()}
          </MenuItem>
        </Menu> */}
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
            <div className="relative inline-block">
              <img
                className="size-8 rounded-full border border-gray-500 shrink-0"
                src={avatar}
                alt=""
              />
              {/* Indicador de estado */}
              <span className={`
                absolute bottom-0 right-0 
                w-2.5 h-2.5 rounded-full border border-white
                ${isOnline ? 'bg-green-500' : 'bg-red-500'}
              `}></span>
            </div>
          </MenuToggle>
          {DropdownUser({ menuItemRef: itemUserRef })}
        </MenuItem>
      </Menu>
    </div>
  );
};

export { HeaderTopbar };

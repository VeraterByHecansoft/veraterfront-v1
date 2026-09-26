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

const HeaderUser = () => {
  const { user } = useAuthContext()
  const itemUserRef = useRef<any>(null);
  const { isOnline } = useAuthContext();
  const { isRTL } = useLanguage();
  const avatar = user?.imgperf ? `https://rute.mx/D?u=${user.imgperf}&t=1` : toAbsoluteUrl(`/media/avatars/${'blank.png'}`)
  return (
    <div className="flex items-center lg:gap-3.5">
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
          {DropdownUser({ menuItemRef: itemUserRef, avatar })}
        </MenuItem>
      </Menu>
    </div>
  );
};

export { HeaderUser };

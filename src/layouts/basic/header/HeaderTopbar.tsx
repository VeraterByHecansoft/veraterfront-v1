import { useEffect, useRef, useState } from 'react';
import { toAbsoluteUrl } from '@/utils';
import { Menu, MenuItem, MenuToggle } from '@/components';
import { DropdownUser } from '@/partials/dropdowns/user';
import { DropdownNotifications } from '@/partials/dropdowns/notifications';
import { useLanguage } from '@/i18n';
import { useAuthContext } from '@/auth';
import { Icon } from '@iconify/react';
import { useTimer } from '@/contexts/timer/TimerContext';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/contexts/store';
import { setSessionTimeOut } from '@/contexts/store/slicers/authSlice';
import { formatTime } from '@/utils/Timing';

const HeaderTopbar = () => {
  const { formattedTime, elapsedTime, togglTimer } = useTimer()
  const { user, } = useAuthContext()
  const { isOnline } = useSelector((state: RootState) => state.auth);
  const itemUserRef = useRef<any>(null);
  const MAX_TIME_SESSION = import.meta.env.VITE_MAX_TIME_SESSION
  const { isRTL } = useLanguage();
  const itemNotificationsRef = useRef<any>(null);
  const [hasNot, setHashNot] = useState(false)
  const { lastEventOk } = useSelector((state: RootState) => state.auth);
  const avatar = user?.imgperf ? `https://rute.mx/D?u=${user.imgperf}&t=1` : toAbsoluteUrl(`/media/avatars/${'blank.png'}`);
  const [elapsedT, setElapsedT] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const elapsed = Math.floor((Date.now() - lastEventOk) / 1000);
    const minutes = Math.floor((elapsed % 3600) / 60);
    if (minutes > MAX_TIME_SESSION) {
      dispatch(setSessionTimeOut(minutes))
    }
    setElapsedT(elapsed);
  }, [elapsedTime])

  return (
    <div className="flex items-center lg:gap-3.5">
      <div className="flex items-center gap-1.5">
        <small >Sin actividad: {formatTime(elapsedT)}</small>
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
              <div className="relative inline-block">
                <Icon icon="heroicons-outline:bell" className="w-6 h-6" />
                {/* Indicador de estado */}
                {hasNot && <span className={`
                absolute bottom-0 right-0 
                w-2.5 h-2.5 rounded-full border border-white
                bg-primary`}></span>}
              </div>
            </MenuToggle>

            {DropdownNotifications({ menuTtemRef: itemNotificationsRef })}
          </MenuItem>
        </Menu>
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

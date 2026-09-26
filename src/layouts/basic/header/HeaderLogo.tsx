import { Link, useLocation } from 'react-router-dom';
import { CustomIcon } from '@/components/custom-icons';
import { toAbsoluteUrl } from '@/utils';
import {
  Menu,
  MenuArrow,
  MenuIcon,
  MenuItem,
  MenuLink,
  MenuSub,
  MenuTitle,
  MenuToggle
} from '@/components/menu';
import { useEffect, useState } from 'react';
import { useBasicLayout } from '..';
import { useLanguage } from '@/i18n';


const HeaderLogo = () => {
  const { pathname } = useLocation();
  const { setMobileSidebarOpen } = useBasicLayout();
  const { isRTL } = useLanguage();

  const handleSidebarOpen = () => {
    setMobileSidebarOpen(true);
  };

  useEffect(() => {
    // MENU_ROOT.forEach((item) => {
    //   if (item.rootPath && pathname.includes(item.rootPath)) {
    //     setSelectedMenuItem(item);
    //   }
    // });
  }, [pathname]);

  return (
    <div className="flex items-center mr-1">
      <div className="flex items-center justify-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleSidebarOpen}
          className="btn btn-icon btn-light btn-clear btn-sm -ms-2 lg:hidden"
        >
          <CustomIcon icon="menu" />
        </button>

        <Link to="/" className="mx-1">
          <img
            src={toAbsoluteUrl('/media/app/mini-logo-primary.svg')}
            className="dark:hidden max-h-[48px]"
            alt="logo"
          />
          <img
            src={toAbsoluteUrl('/media/app/mini-logo-primary-dark.svg')}
            className="hidden dark:inline-block max-h-[48px]"
            alt="logo"
          />
        </Link>
      </div>
      <div className="flex items-center ">
        <span className="text-sm text-[--tw-text] dark:text-[--tw-text-dark] font-medium px-2.5 hidden md:inline">{pathname}</span>
 


        {/* <Menu className="menu-default">
          <MenuItem
            toggle="dropdown"
            trigger="hover"
            dropdownProps={{
              placement: isRTL() ? 'bottom-end' : 'bottom-start',
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 10] // [skid, distance]
                  }
                }
              ]
            }}
          >
            <MenuToggle className="text-gray-900 font-medium">
              {selectedMenuItem.title}
              <MenuArrow>
                <CustomIcon icon="down" />
              </MenuArrow>
            </MenuToggle>
            <MenuSub className="menu-default w-48 py-2">
              {MENU_ROOT.map((item, index) => (
                <MenuItem key={index} className={item === selectedMenuItem ? 'active' : ''}>
                  <MenuLink path={item.path}>
                    {item.icon && (
                      <MenuIcon>
                        <CustomIcon icon={item.icon} />
                      </MenuIcon>
                    )}
                    <MenuTitle>{item.title}</MenuTitle>
                  </MenuLink>
                </MenuItem>
              ))}
            </MenuSub>
          </MenuItem>
        </Menu> */}
      </div>
    </div>
  );
};

export { HeaderLogo };

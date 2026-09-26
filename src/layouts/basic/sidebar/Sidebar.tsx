/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from 'react-router-dom';
import { CustomIcon } from '@/components/custom-icons';
import { useResponsive, useViewport } from '@/hooks';
import { useBasicLayout, } from '..';
import { useEffect, useState } from 'react';
import { usePathname } from '@/providers';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import Tippy from '@tippyjs/react';
import { Icon } from '@iconify/react';
import { getModules, ModuleAuthItem, ModuleAuthItems } from '@/auth';

import 'tippy.js/dist/tippy.css'; // Estilos básicos


const Sidebar = () => {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useBasicLayout();
  const { pathname, prevPathname } = usePathname();
  const desktopMode = useResponsive('up', 'lg');
  const mobileMode = useResponsive('down', 'lg');
  const [viewportHeight] = useViewport();
  const [items, setItems] = useState<ModuleAuthItems | undefined>(undefined);
  const scrollableOffset = 70;
  const scrollableHeight = viewportHeight - scrollableOffset;

  let dashboard = {
    name: 'dashboard',
    title: 'Dashboard',
    tooltip: 'Dashboard',
    path: '/panel',
    icon: 'heroicons-outline:home',
    color: '#3F51B5',
    active: pathname === '/',
    type: 'module',
  } as ModuleAuthItem;

  let profile = {
    name: 'account',
    title: 'Mi cuenta',
    tooltip: 'Administra tu cuenta de usuario',
    path: '/account/profile',
    icon: 'heroicons-outline:user-circle',
    color: '#3F51B5',
    active: pathname === '/account/profile',
    type: 'module',
  } as ModuleAuthItem;

  let initialsItems: ModuleAuthItems = [dashboard, profile];

  const handleMobileSidebarClose = () => {
    setMobileSidebarOpen(false);
  };

  useEffect(() => {
    const sidebarItems = getModules();
    const menu = [...initialsItems, ...sidebarItems || []].map((item) => {
      return { ...item, active: pathname === item.path }
    })
    setItems(menu);
  }, [pathname]);

  const renderContent = () => {
    return (
      <div className="fixed w-[--tw-sidebar-width] lg:top-[--tw-header-height] top-0 bottom-0 z-20 lg:flex flex-col items-stretch shrink-0 group py-3 lg:py-0">
        <div className="flex grow shrink-0">
          <div
            className="scrollable-y-auto grow gap-2.5 shrink-0 flex items-center flex-col"
            style={{
              ...(desktopMode && scrollableHeight > 0 && { height: `${scrollableHeight}px` })
            }}
          >
            {items && items.map((item, index) =>
              item.path.startsWith('http') ? (
                <Tippy key={index} content={item.tooltip} placement="right">
                  <a
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn btn-icon btn-icon-lg rounded-full size-10 border here:border-gray-300 
                    text-gray-600 hover:bg-light hover:text-primary hover:border-gray-300 
                    ${item?.active ? 'bg-light text-primary' : 'text-[--tw-text] dark:text-[--tw-text-dark]'
                      }`}
                  >
                    <span className="menu-icon">
                      <CustomIcon icon={item.icon} className="w-6 h-6" />
                    </span>
                  </a>
                </Tippy>
              ) : (
                <Tippy key={index} content={item.tooltip} placement="right">
                  <Link
                    to={item.path}

                    data-tooltip={item.tooltip}
                    data-tooltip-placement="right"
                    className={`btn btn-icon btn-icon-lg rounded-full size-10 border 
                      active:border-gray-300 
                      active:text-gray-600 
                      hover:bg-light 
                      hover:text-primary 
                      hover:border-gray-300 
                      ${item?.active ? 'bg-light ' : 'text-[--tw-text] dark:text-[--tw-text-dark]'
                      }`}
                  >
                    <span className="menu-icon">
                      <CustomIcon icon={item.icon} className="w-6 h-6" />
                    </span>
                    <span className="tooltip">{item.tooltip}</span>
                  </Link>
                </Tippy>
              )
            )}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {

    if (mobileMode && prevPathname !== pathname) {
      handleMobileSidebarClose();
    }
  }, [mobileMode, pathname, prevPathname]);

  if (desktopMode) {
    return renderContent();
  } else {
    return (
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent
          className="border-0 p-0 w-[--tw-sidebar-width] scrollable-y-auto"
          forceMount={true}
          side="left"
          close={false}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Mobile Menu</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          {renderContent()}
        </SheetContent>
      </Sheet>
    );
  }
};

export { Sidebar };

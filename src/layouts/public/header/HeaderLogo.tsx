import { Link, useLocation } from 'react-router-dom';
import { CustomIcon } from '@/components/custom-icons';
import { toAbsoluteUrl } from '@/utils';

import { generalSettings, MENU_ROOT } from '@/config';
import { useEffect, useState } from 'react';
import { usePublicLayout } from '..';
import { useLanguage } from '@/i18n';

const HeaderLogo = () => {
  const { pathname } = useLocation();
  const [selectedMenuItem, setSelectedMenuItem] = useState(MENU_ROOT[1]);
  const { setMobileSidebarOpen } = usePublicLayout();
  const { isRTL } = useLanguage();

  const handleSidebarOpen = () => {
    setMobileSidebarOpen(true);
  };

  useEffect(() => {
    MENU_ROOT.forEach((item) => {
      if (item.rootPath && pathname.includes(item.rootPath)) {
        setSelectedMenuItem(item);
      }
    });
  }, [pathname]);

  return (
    <div className="flex items-center mr-1">
      <div className="flex items-center justify-center  gap-2 shrink-0">
        <button
          type="button"
          onClick={handleSidebarOpen}
          className="btn btn-icon btn-light btn-clear btn-sm -ms-2 lg:hidden"
        >
          <CustomIcon icon="menu" />
        </button>

        <Link to="/" className="mx-4">
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
      <div className="flex items-center">
        {/* <h3 className="text-gray-700 text-base hidden md:block">{generalSettings.company_name}</h3> */}
        {/* <span className="text-sm text-gray-400 font-medium px-2.5 hidden md:inline">{pathname}</span> */}
      </div>
    </div>
  );
};

export { HeaderLogo };

import { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router';
import { useMenuCurrentItem } from '@/components/menu';
import { useMenus } from '@/providers';
import { CustomIcon } from '@/components';
import { Header, Navbar, Sidebar, Footer, Toolbar, ToolbarActions, ToolbarHeading } from '..';
import { useAuthContext } from '@/auth';
import { useSocket } from '@/contexts/socket/SocketProvider';
import { setOnlineStatus } from '@/contexts/store/slicers/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/contexts/store';

const Main = () => {
  // const {socket} = useSocket()
  const dispatch =useDispatch<AppDispatch>()
  const { pathname } = useLocation();
  const { getMenuConfig } = useMenus();
  const menuConfig = getMenuConfig('primary');
  const menuItem = useMenuCurrentItem(pathname, menuConfig)||{};
  const showSideBar = true;
  const showHeader = true;
  // useEffect(() => {
  //   if (socket) {
  //     dispatch(setOnlineStatus(socket.OPEN));
  //   }
  // }, [socket]);
  let SIDEBAR = showSideBar ? "lg:ms-[--tw-sidebar-width]" : "";
  let HEADDER = showHeader ? "pt-[--tw-header-height]" : ""
  return (
    <Fragment>
      <Helmet>
        <title>{menuItem?.title}</title>
      </Helmet>
      <div className="flex grow">
        {showHeader && (<Header />)}
        <div className={`flex flex-col lg:flex-row grow ${HEADDER}`}>
          {showSideBar && (<Sidebar />)}
          {/* <Navbar /> */}
          <div className={`flex grow rounded-b-xl bg-[--tw-content-bg] dark:bg-[--tw-content-bg-dark] border-x border-b border-gray-400 dark:border-gray-200 lg:mt-[--tw-navbar-height] mx-5 ${SIDEBAR} mb-5`}>
            <div className="flex flex-col grow lg:scrollable-y lg:[scrollbar-width:auto] lg:light:[--tw-scrollbar-thumb-color:var(--tw-content-scrollbar-color)] pt-7 lg:[&_.container-fluid]:pe-4">
              <main className="grow" role="content">
                <Outlet />
              </main>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export { Main };

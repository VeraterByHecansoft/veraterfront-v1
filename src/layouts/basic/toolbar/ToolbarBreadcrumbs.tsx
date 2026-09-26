import { Fragment } from 'react';
import { TMenuConfig, useMenuBreadcrumbs } from '@/components';
import { Link } from 'react-router-dom';
import { useMenus } from '@/providers';
import { useLocation } from 'react-router';

export interface ToolbarBreadcrumbsProps {
 items?: TMenuConfig | null
}

const ToolbarBreadcrumbs = ({items=null}:ToolbarBreadcrumbsProps) => {
  const { getMenuConfig } = useMenus();
  const { pathname } = useLocation();
  const itemS = items?useMenuBreadcrumbs(pathname,items):useMenuBreadcrumbs(pathname, getMenuConfig('primary'))

  return (
    <div className="flex items-center gap-1 text-sm font-normal">
      {itemS.map((item:any, index:number) => (
        <Fragment key={index}>
          {item.path ? (
            <Link to={item.path} className="text-gray-700 hover:text-primary">
              {item.title}
            </Link>
          ) : (
            <span className={index === itemS.length - 1 ? 'text-gray-900' : 'text-gray-700'}>
              {item.title}
            </span>
          )}
          {index !== itemS.length - 1 && <span className="text-gray-400 text-sm">/</span>}
        </Fragment>
      ))}
    </div>
  );
};

export { ToolbarBreadcrumbs };

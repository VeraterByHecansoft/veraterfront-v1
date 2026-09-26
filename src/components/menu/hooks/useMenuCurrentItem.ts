import { matchPath } from 'react-router';

import { IMenuItemConfig, type TMenuConfig } from '../types';
import { getModules, ModuleAuthItem, ModuleAuthItems } from '@/auth';

const useMenuCurrentItem = (
  pathname: string,
  items: TMenuConfig | null
): IMenuItemConfig | null => {
  pathname = pathname.trim();

  const findCurrentItem = (items: TMenuConfig | null): IMenuItemConfig | null => {
    if (!items) return null;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.path && matchPath(pathname, item.path)) {
        return item ?? null;
      } else if (item.children) {
        const childItem = findCurrentItem(item.children as TMenuConfig);
        if (childItem) {
          return childItem;
        }
      }
    }

    return null;
  };

  return findCurrentItem(items);
};

/**\
 *   name: string;
  title?: string;
  tooltip?:string;
  description: string;
  path: string;
  icon: string;
  color?:string;
  type: string;
  active: boolean;
 */
const useMenuCurrentItemDinamic = (
  pathname: string,
  items: ModuleAuthItems | null
): ModuleAuthItem | null => {
  pathname = pathname.trim();

  const findCurrentItem = (items: ModuleAuthItems | null): ModuleAuthItem | null => {
    if (!items) return null;
    const MenueI = items.filter(item=>item.path && matchPath(pathname, item.path));
    if(MenueI && MenueI.length ==1){
      return MenueI[0]
    }

    return null;
  };

  return findCurrentItem( items||[]);
};

export { useMenuCurrentItem,useMenuCurrentItemDinamic };

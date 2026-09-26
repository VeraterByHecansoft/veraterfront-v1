import { useMenus } from '@/providers';
import { NavbarMenu } from '@/partials/menu/NavbarMenu';
import { getModules } from '@/auth';

const PageMenu = () => {
  // const { getMenuConfig } = useMenus();
  // const menuConfig = getMenuConfig('primary');
  const sidebarItems = getModules();
  const accountMenuConfig = sidebarItems?.map((item)=>{
    return {
      title: item?.title,
      disabled: false,
      heading: item.name,
      icon: item.icon,
      // badge: string;
      separator: false,
      tooltip: item?.tooltip,
      path: item.path,
      rootPath: "",
      bullet: false,
      collapse: false,
      collapseTitle: "",
      expandTitle: "",
      // toggle?: TMenuItemToggle;
      // dropdownProps?: TMenuDropdown;
      // trigger?: TMenuItemTrigger;
      // children?: IMenuItemConfig[];
      // childrenIndex?: number;1
    }
  })

  if (accountMenuConfig) {
    return <NavbarMenu items={accountMenuConfig} />;
  } else {
    return <>test</>;
  }
};

export { PageMenu };

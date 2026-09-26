import { ReactNode } from 'react';
import { useMenuCurrentItemDinamic } from '@/components';
import { useLocation } from 'react-router';
import { ToolbarBreadcrumbs } from './ToolbarBreadcrumbs';
import { getModules } from '@/auth';

export interface IToolbarHeadingProps {
  title?: string | ReactNode;
  description?: string | ReactNode;
}

const ToolbarHeading = ({ title = '', description='' }: IToolbarHeadingProps) => {
  const { pathname } = useLocation();
  const modules = getModules()
  const currentMenuItem = useMenuCurrentItemDinamic(pathname, modules||[]);
  return (
    <div className="flex items-center flex-wrap gap-1 lg:gap-5">
      <h1 className="font-medium text-lg text-gray-900">{title || currentMenuItem?.title}</h1>
      <ToolbarBreadcrumbs items={modules} />
    </div>
  );
};

export { ToolbarHeading };

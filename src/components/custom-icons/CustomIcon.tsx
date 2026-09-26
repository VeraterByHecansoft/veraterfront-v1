import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { useSettings } from '@/providers';
import { ICustomIconsProps } from './types';
import { Icon } from '@iconify/react';



export const CustomIcon: React.FC<ICustomIconsProps> = ({ icon, style, className = '', color='', ...props }) => {
  const { settings } = useSettings();
  const resolvedStyle = style || settings.IconsStyle;
  const iconName = `${icon.split(":").length>=2?icon:`heroicons-outline:${icon}`}`
  return (
    <Icon
    color={color||undefined}
      icon={iconName}
      className={className}
      {...props}
    />
  );
};
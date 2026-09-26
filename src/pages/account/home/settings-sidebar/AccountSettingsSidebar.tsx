import { IScrollspyMenuItems, ScrollspyMenu } from '@/partials/menu';

const AccountSettingsSidebar = () => {
  const items: IScrollspyMenuItems = [
    {
      title: 'Datos Básicos',
      target: 'basic_settings',
      active: true
    },
    {
      title: 'Authentication',
      children: [
        {
          title: 'Email',
          target: 'auth_email',
          active: false
        },
        {
          title: 'Password',
          target: 'auth_password'
        },
      ]
    },
  ];

  return <ScrollspyMenu items={items} />;
};

export { AccountSettingsSidebar };

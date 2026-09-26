import { IScrollspyMenuItems, ScrollspyMenu } from '@/partials/menu';

const AddMemberSidebar = () => {
  const items: IScrollspyMenuItems = [
    {
      title: 'Datos Vasicos',
      target: 'basic_settings',
      active: true
    },
  ];

  return <ScrollspyMenu items={items} />;
};

export { AddMemberSidebar };

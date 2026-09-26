import { IScrollspyMenuItems, ScrollspyMenu } from '@/partials/menu';

const AddProductSidebar = () => {
  const items: IScrollspyMenuItems = [
    {
      title: 'Datos Basicos',
      target: 'basic_settings',
      active: true
    },
    {
      title: 'Extras',
      target: '',
      children: [
        {
          title: 'Atributos Extra',
          target: 'extra_attr',
          active: false
        },
        {
          title: 'Inventario',
          target: 'inventore_attrs'
        },
    
      ]
    },
  ];

  return <ScrollspyMenu items={items} />;
};

export { AddProductSidebar };

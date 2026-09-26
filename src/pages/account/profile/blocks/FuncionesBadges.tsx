
import { Icon } from '@iconify/react';
import { CommonHexagonBadge } from '@/partials/common';

interface ICommunityBadgesItem {
  stroke: string;
  fill: string;
  icon: string;
  iconColor: string;
  tooltip?:string
}
interface ICommunityBadgesItems extends Array<ICommunityBadgesItem> {}

interface ICommunityBadgesProps {
  title: string;
}

const FuncionesBadges = ({ title }: ICommunityBadgesProps) => {
  const items: ICommunityBadgesItems = [
    {
      stroke: '#E40E20',
      fill: 'fill-brand-light',
      icon: 'heroicons-outline:arrow-up-tray',
      iconColor: '#E40E20',
      tooltip:'Enviar'
    },
    {
      stroke: '#22C55E',
      fill: 'fill-brand-light',
      icon: 'heroicons-outline:currency-dollar',
      iconColor: '#22C55E',
      tooltip:'Recibir'
    },
    {
      stroke: '#1235E0',
      fill: 'fill-brand-light',
      icon: 'heroicons-outline:banknotes',
      iconColor: '#1235E0',
      tooltip:'Pagos'
    },
    {
      stroke: '#E40E20',
      fill: 'fill-brand-light',
      icon: 'heroicons-outline:credit-card',
      iconColor: '#E40E20',
      tooltip:'Tarjetas'
    }
  ];

  const renderItem = (item: ICommunityBadgesItem, index: number) => {
    return (
      <CommonHexagonBadge
        key={index}
        stroke={item.stroke}
        fill={item.fill}
        size="size-[50px]"
        tooltip={item.tooltip}
        badge={<Icon icon={item.icon} color={item.iconColor} className={`text-1.5xl ps-px`} />}
      />
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>

      <div className="card-body pb-7.5">
        <div className="flex items-center flex-wrap gap-3 lg:gap-4">
          {items.map((item, index) => {
            return renderItem(item, index);
          })}
        </div>
      </div>
    </div>
  );
};

export {
  FuncionesBadges,
  type ICommunityBadgesItem,
  type ICommunityBadgesItems,
  type ICommunityBadgesProps
};

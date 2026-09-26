
import { Icon } from '@iconify/react';
import { CommonHexagonBadge } from '@/partials/common';

interface ICommunityBadgesItem {
  stroke: string;
  fill: string;
  icon: string;
  iconColor: string;
}
interface ICommunityBadgesItems extends Array<ICommunityBadgesItem> {}

interface ICommunityBadgesProps {
  title: string;
}

const CommunityBadges = ({ title }: ICommunityBadgesProps) => {
  const items: ICommunityBadgesItems = [
    {
      stroke: 'stroke-primary-clarity',
      fill: 'fill-primary-light',
      icon: 'heroicons-outline:abstract-39',
      iconColor: 'text-primary'
    },
    {
      stroke: 'stroke-brand-clarity',
      fill: 'fill-brand-light',
      icon: 'heroicons-outline:abstract-44',
      iconColor: 'text-brand'
    },
    {
      stroke: 'stroke-success-clarity',
      fill: 'fill-success-light',
      icon: 'heroicons-outline:abstract-25',
      iconColor: 'text-success'
    },
    {
      stroke: 'stroke-info-clarity',
      fill: 'fill-info-light',
      icon: 'heroicons-outline:delivery-24',
      iconColor: 'text-info'
    }
  ];

  const renderItem = (item: ICommunityBadgesItem, index: number) => {
    return (
      <CommonHexagonBadge
        key={index}
        stroke={item.stroke}
        fill={item.fill}
        size="size-[50px]"
        badge={<Icon icon={item.icon} className={`text-1.5xl ps-px ${item.iconColor}`} />}
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
  CommunityBadges,
  type ICommunityBadgesItem,
  type ICommunityBadgesItems,
  type ICommunityBadgesProps
};

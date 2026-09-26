// FuncionesIconsOnly.tsx
import { CommonHexagonBadge } from '@/partials/common';
import { CustomIcon } from '@/components';
import { IBadgesItem } from '@ui/custom';


interface FuncionesIconsOnlyProps {
  onPress?: (event: string) => void,
  items?:IBadgesItem[]
}

const FuncionesIconsOnly = ({ items=[], onPress }: FuncionesIconsOnlyProps) => {
  const handleClickFns = (event: IBadgesItem) => {
    if (event.event) onPress?.(event.event)
  }
  return (
    <> <div className="flex items-center flex-wrap gap-3 lg:gap-4 hover:cursor-pointer">
      {items.map((item, index) => (
        <CommonHexagonBadge
          key={index}
          onPress={() => { handleClickFns(item) }}
          stroke={item.stroke}
          fill={item.fill}
          size="size-[50px]"
          tooltip={item.tooltip}
          badge={
            <CustomIcon
              icon={item.icon}
              color={item.iconColor}
              className="text-1.5xl ps-px"
            />
          }
        />
      ))}
    </div>
    </>
  );
};
//

export { FuncionesIconsOnly };

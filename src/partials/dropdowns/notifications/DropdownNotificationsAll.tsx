import { useEffect, useRef, useState } from 'react';
import { getHeight } from '@/utils';
import { useViewport } from '@/hooks';
import { DropdownNotificationsItem } from './items/DropdownNotificationsItem';
interface DropdownNotificationsAllProps {
  menuTtemRef?: any;
}
const DropdownNotificationsAll = ({ menuTtemRef }: DropdownNotificationsAllProps) => {
  const footerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState<number>(0);
  const [viewportHeight] = useViewport();
  const offset = 300;

  useEffect(() => {
    if (footerRef.current) {
      const footerHeight = getHeight(footerRef.current);
      const availableHeight = viewportHeight - footerHeight - offset;
      setListHeight(availableHeight);
    }
  }, [viewportHeight]);

  const handleIAceptItem = (event: any) => {
    if (menuTtemRef.current) menuTtemRef.current.hide();
  }
  const handleAceptarTodas = (event: any) => {
    if (menuTtemRef.current) menuTtemRef.current.hide();
  }
  const handleArchivarTodas = (event: any)=>{
    if (menuTtemRef.current) menuTtemRef.current.hide();
  }
  const buildList = () => {
    return (
      <div className="flex flex-col gap-5 pt-3 pb-4 divider-y divider-gray-200">
        <DropdownNotificationsItem
          userName="Sistema STP"
          // avatar="300-27.png"
          badgeColor="bg-gray-400"
          description="Trasferencia de 100.00 MXN"
          link={{ to: '/panem', text: "ver detalles" }}
          date="14 hours ago"
          info="STP"
          onAcept={() => { handleIAceptItem({}) }}
        />
        <div className="border-b border-b-gray-200"></div>
      </div>
    );
  };

  const buildFooter = () => {
    return (
      <>
        <div className="border-b border-b-gray-200"></div>
        <div className="grid grid-cols-2 p-5 gap-2.5">
          <button className="btn btn-sm btn-light justify-center" onClick={handleArchivarTodas}>Archivar Todas</button>
          <button className="btn btn-sm btn-light justify-center" onClick={handleAceptarTodas}>Marcar todas cómo leidas</button>
        </div>
      </>
    );
  };

  return (
    <div className="grow">
      <div className="scrollable-y-auto" style={{ maxHeight: `${listHeight}px` }}>
        {buildList()}
      </div>
      <div ref={footerRef}>{buildFooter()}</div>
    </div>
  );
};

export { DropdownNotificationsAll };

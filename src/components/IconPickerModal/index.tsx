import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { heroiconsOutlineIcons } from '@/types/icons';
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';

export interface IconPickerModalProps {
    isOpen:boolean;
    onClose:()=>void;
    onSelect:(icon:any)=>void;
}
  const IconPickerModal = ({ isOpen, onClose, onSelect }:IconPickerModalProps) => {
    const parentRef = useRef<any | null>(null);
    const iconList = heroiconsOutlineIcons
    // [
    //   'heroicons-',
    //   'akar-icons:arrow-up', 'bi:star', 'bx:bxs-heart', 'mdi:home', 'cil:cloud-download', 'fa-solid:coffee'
    // ];
  
    const [searchQuery, setSearchQuery] = useState('');
    const filteredIcons = iconList.filter(icon =>
      icon.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="container-fixed max-w-[auto] flex flex-col p-10 overflow-hidden [&>button]:hidden">
          <DialogHeader className="p-0 border-0">
          <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
            <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5">
              <div className="flex flex-col justify-center gap-2">
                <h1 className="text-xl font-semibold leading-none text-gray-900">Selecciona un icono</h1>
                <div className="flex items-center gap-2 text-sm font-normal text-gray-700">
                  Selecciona un Icono para el rol, asó lo podrás identificar mejor
                </div>
              </div>
              <button className="btn btn-sm btn-light" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </DialogHeader>
          <DialogBody className="scrollable-y py-0 mb-5 ps-0 pe-3 -me-7" ref={parentRef}>
            <div className="flex grow gap-5 lg:gap-7.5">
            <div className="flex flex-col items-stretch grow gap-5 lg:gap-7.5">
  
  
            <div className="w-full">
              <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <input
                  className="input"
                  type="text"
                  value={searchQuery}
                  placeholder='Busca entre los iconos disponibles'
                  onChange={(e) => setSearchQuery(e.target.value)}
                />  
              </div>
            </div>
  
                 <div className="icon-grid">
              {filteredIcons.map((icon, index) => (
                <div key={index} className="icon-item" onClick={() => onSelect(icon)}>
                  <Icon icon={icon} width={40} height={40} />
                </div>
              ))}
            </div>
              </div>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>)
  };
  
  export default IconPickerModal;
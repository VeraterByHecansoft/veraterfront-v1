import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useRef, useState } from 'react';

export interface ColorPickerModalProps {
    isOpen:boolean;
    onClose:()=>void;
    onSelect:(icon:any)=>void;
}

const ColorPickerModal = ({ isOpen, onClose, onSelect }:ColorPickerModalProps) => {
    const parentRef = useRef<any | null>(null);
    
    const defaultColors = [
      '#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#9B59B6', '#1ABC9C',
      '#E67E22', '#34495E', '#2ECC71', '#E74C3C', '#3498DB', '#8E44AD'
    ];
    const [selectedColor, setSelectedColor] = useState<string>('');

    const handleColorSelect = (color: string) => {
      setSelectedColor(color);
      onSelect(color); // Devuelve el color seleccionado
      onClose(); // Cierra automáticamente el modal al seleccionar (opcional)
    };
    
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="container-fixed max-w-[auto] flex flex-col p-10 overflow-hidden [&>button]:hidden">
          <DialogHeader className="p-0 border-0">
          <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
            <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5">
              <div className="flex flex-col justify-center gap-2">
                <h1 className="text-xl font-semibold leading-none text-gray-900">Selecciona un color</h1>
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
                    {defaultColors.map((color) => (
                      <div
                        key={color}
                        className={`w-10 h-10 rounded-full cursor-pointer border-2 transition-all duration-200 ${
                          selectedColor === color ? 'border-black scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorSelect(color)}
                      />
                    ))}
                  </div>
                </div>
                <div className="icon-grid">
                  {/** Aqui la paleta de colores seleccionables */}
                </div>
              </div>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>)
  };
  
  export default ColorPickerModal;
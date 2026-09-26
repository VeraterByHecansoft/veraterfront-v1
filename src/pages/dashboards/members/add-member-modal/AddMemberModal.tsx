import { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { AuthEmail, AuthPassword, BasicSettings } from './blocks';

interface IModalProfileProps {
  open: boolean;
  onOpenChange: () => void;
  member?:any|undefined
}

const   AddMemberModal = ({ open, onOpenChange, member }: IModalProfileProps) => {
  const parentRef = useRef<any | null>(null);
  const handleOnSave = ()=>{
    onOpenChange()
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="container-fixed max-w-[auto] flex flex-col p-10 overflow-hidden [&>button]:hidden">
        <DialogHeader className="p-0 border-0">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5">
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-xl font-semibold leading-none text-gray-900">Agregar usuario</h1>
            </div>
            <button className="btn btn-sm btn-light" onClick={onOpenChange}>
              Cancelar
            </button>
          </div>
        </DialogHeader>
        <DialogBody className="scrollable-y py-0 mb-5 ps-0 pe-3 -me-7" ref={parentRef}>
          <div className="flex grow gap-5 lg:gap-7.5">
            <div className="flex flex-col items-stretch grow gap-5 lg:gap-7.5">
              <BasicSettings member={member} onSave={handleOnSave} />
              {member&&<AuthPassword member={member} onSave={handleOnSave} /> }
              {member&&<AuthEmail member={member} onSave={handleOnSave}  />}
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { AddMemberModal };

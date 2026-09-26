import { useRef, useState } from 'react';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

import { useAuthContext } from '@/auth';

interface IModalProfileProps {
  open: boolean;
  onOpenChange: () => void;
}

const ReciveModal = ({ open, onOpenChange }: IModalProfileProps) => {
  const { user } = useAuthContext()
  const parentRef = useRef<any | null>(null);
  const [copiado, setCopiado] = useState(false);

  const copiarClabe = () => {
    if (user) {
      navigator.clipboard.writeText(user.CLABE);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }

  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[350px] p-2 overflow-hidden ">
        <DialogHeader className="p-0 border-0">
          <DialogTitle className="p-4 text-2xl font-bold text-gray-800 text-center">
            Mis Datos
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DialogBody className="scrollable-y " ref={parentRef}>
          <div className="flex flex-col items-stretch grow gap-2">
            <div className="max-w-md mx-auto rounded-xl space-y-4">
              <div className="space-y-3">
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Nombre completo</h2>
                  <p className="text-lg font-semibold text-gray-900">
                    {`${user?.NOMBRE} ${user?.APP} ${user?.APM}`}
                  </p>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Banco</h2>
                  <p className="text-lg font-semibold text-blue-600">
                    STP
                  </p>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">CLABE</h2>
                  <div
                    className="group flex items-center justify-between p-3 bg-gray-100 rounded-lg cursor-pointer"
                    onClick={copiarClabe}
                  >
                    <span className="text-lg font-mono text-gray-800">
                      {user?.CLABE}
                    </span>
                    <div className="relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-400 group-hover:text-blue-500 transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>

                      {copiado && (
                        <span className="absolute -top-8 -right-2 bg-green-500 text-white px-2 py-1 rounded text-xs animate-bounce">
                          ¡Copiado!
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Haz clic en la CLABE para copiar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { ReciveModal };

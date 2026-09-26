import { useRef, useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useAuthContext } from "@/auth";
import { useAPIContext } from "@/auth/useAPIContext";
import { IstpData } from '..';
interface IModalProps {
  open: boolean;
  onOpenChange: (refresh: boolean) => void;
  selected: IstpData
}

export default function ModalPago({ selected, open, onOpenChange }: IModalProps) {
  const { user } = useAuthContext()
  const { post } = useAPIContext()
  const [step, setStep] = useState(1);
  const parentRef = useRef<any | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  // Mensajes
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [doing, setDoing] = useState(false);
  const handleNext = () => setStep(step + 1);

  async function handleSubmit() {
    if (!doing) {
      setMessage("Procesando...");
      setDoing(true)
      try {
        const params = {
          iddoc: selected.iddoc
        };

        const r = await post("/pay/charge", params) as any

        // ✅ Validamos estructura
        if (r && typeof r === "object" && "message" in r && "success" in r && r.success && "data" in r) {
          const data = r.data
          const redirection_url = data?.redirection_url
          if (redirection_url) {
            setMessage("Verificando...");
            setRedirectUrl(redirection_url); // ⬅️ aquí la guardas
            handleNext(); // supongo que esto hace step=2
            setDoing(false);
          } else {
            setError('Error en la Operación');
            setDoing(false)
            // onOpenChange(true)
          }
        } else {
          console.warn("Formato inesperado:", r?.message);
          setError(r?.message || "Respuesta inesperada del servidor");
          setDoing(false)
        }
      } catch (err: any) {
        console.error(err);
        setError("Error procesando el pago");
        setDoing(false)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => { onOpenChange(false) }}>
      <DialogContent className="max-w-[450px] max-h-[750px] p-2 overflow-hidden">
        <DialogHeader className="p-0 border-0">
          <DialogTitle className="p-2 text-2xl font-bold text-gray-800 text-center">
            Cobrar
          </DialogTitle>
          <DialogDescription className="p-0"></DialogDescription>
        </DialogHeader>
        <DialogBody className="flex p-0" ref={parentRef}>
          <div className="w-full bg-gray-100 p-4 scrollable-y max-h-[550px]">
            <div className="p-1 w-full max-w-md">
              {step === 1 && (
                <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col gap-3">
                  <h2 className="text-lg font-bold mb-2">Datos del Cliente</h2>

                  {message && <p className="text-sm text-info">{message}</p>}
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button type="button" onClick={handleSubmit} disabled={doing}
                    className="bg-indigo-600 text-white p-2 rounded mt-2 hover:bg-indigo-700 transition">
                    Ejecutar Cobro
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col gap-3">
                  {redirectUrl ? (
                    <iframe
                      src={redirectUrl}
                      className="w-full h-[600px] rounded-lg border"
                      title="Verificación de Pago"
                    />
                  ) : (
                    <p className="text-center text-gray-500">Cargando...</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

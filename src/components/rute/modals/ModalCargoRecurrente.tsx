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

interface IModalProps {
  open: boolean;
  onOpenChange: () => void;
}

export default function ModalCargoRecurrente({ open, onOpenChange }: IModalProps) {
  const { user } = useAuthContext()
  const { post } = useAPIContext()
  const [step, setStep] = useState(1);
  const parentRef = useRef<any | null>(null);

  // Datos de tarjeta
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvc, setCvc] = useState("");

  // Datos de pago
  const [amount, setAmount] = useState(0);
  const [period, setPeriod] = useState("");

  // Mensajes
  const [message, setMessage] = useState("");

  // Datos cliente
  const [clientData, setClientData] = useState({
    first_name: "",
    last_name: "",
    address_one: "",
    city: "",
    state: "",
    zipcode: "",
    email: "",
    country: "",
    date_of_birth: "NA", // Opcional
    last4ssn: "NA",
    phone: "",
    username: "verater",
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  // 🔹 Validaciones
  const validateStep1 = () => {
    const required = ["first_name", "last_name", "address_one", "city", "state", "zipcode", "email", "country"];
    for (const field of required) {
      if (!(clientData as any)[field]) {
        setMessage("Por favor, completa todos los campos de cliente.");
        return false;
      }
    }
    setMessage("");
    return true;
  };

  const validateStep2 = () => {
    if (!amount || amount <= 0) {
      setMessage("El monto debe ser mayor a 0.");
      return false;
    }
    if (!period) {
      setMessage("Selecciona un período de pago.");
      return false;
    }
    setMessage("");
    return true;
  };

  const validateStep3 = () => {
    const cardNumberRegex = /^\d{16}$/;
    const expMonthRegex = /^(0[1-9]|1[0-2])$/;
    const expYearRegex = /^(0[1-9]|1[0-2])$/; // /^(\d{2}|\d{4})$/;
    const cvcRegex = /^\d{3,4}$/;

    if (!cardNumberRegex.test(number)) {
      setMessage("Número de tarjeta inválido.");
      return false;
    }
    if (!name) {
      setMessage("Nombre del titular es obligatorio.");
      return false;
    }
    if (!expMonthRegex.test(expMonth)) {
      setMessage("Mes de expiración inválido.");
      return false;
    }
    if (!expYearRegex.test(expYear)) {
      setMessage("Año de expiración inválido.");
      return false;
    }
    if (!cvcRegex.test(cvc)) {
      setMessage("CVC inválido.");
      return false;
    }
    setMessage("");
    return true;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Procesando...");

    try {
      const params = {
        client: { ...clientData },
        tarjeta: {
          pan: number,
          name_cc: name,
          sc: cvc,
          exp_year: expYear,
          exp_month: expMonth,
        },
        payment: {
          amount,
          currency: "MXN",
          period,
        },
      };

      const r = await post("/pay/createPayment", params) as any

      // ✅ Validamos estructura
      if (r && typeof r === "object" && "message" in r && "success" in r && r.success) {
        console.log("Respuesta backend:", r);
        setMessage(r.message);
      } else {
        console.warn("Formato inesperado:", r?.message);
        setMessage( r?.message||"Respuesta inesperada del servidor");
      }
    } catch (err: any) {
      console.error(err);
      setMessage("Error procesando el pago");
    }
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                <form className="bg-white p-4 rounded-xl shadow-lg flex flex-col gap-3">
                  <h2 className="text-lg font-bold mb-2">Datos del Cliente</h2>
                  <input type="text" placeholder="Nombre" value={clientData.first_name}
                    onChange={(e) => setClientData({ ...clientData, first_name: e.target.value })}
                    className="border rounded p-2 w-full" />
                  <input type="text" placeholder="Apellido" value={clientData.last_name}
                    onChange={(e) => setClientData({ ...clientData, last_name: e.target.value })}
                    className="border rounded p-2 w-full" />
                  <input type="text" placeholder="Dirección" value={clientData.address_one}
                    onChange={(e) => setClientData({ ...clientData, address_one: e.target.value })}
                    className="border rounded p-2 w-full" />
                  <input type="text" placeholder="Ciudad" value={clientData.city}
                    onChange={(e) => setClientData({ ...clientData, city: e.target.value })}
                    className="border rounded p-2 w-full" />
                  <input type="text" placeholder="Estado" value={clientData.state}
                    onChange={(e) => setClientData({ ...clientData, state: e.target.value })}
                    className="border rounded p-2 w-full" />
                  <input type="text" placeholder="CP" value={clientData.zipcode}
                    onChange={(e) => setClientData({ ...clientData, zipcode: e.target.value })}
                    className="border rounded p-2 w-full" />
                  <input type="email" placeholder="Email" value={clientData.email}
                    onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                    className="border rounded p-2 w-full" />
                  <input type="text" placeholder="País" value={clientData.country}
                    onChange={(e) => setClientData({ ...clientData, country: e.target.value })}
                    className="border rounded p-2 w-full" />
                  <input type="text" placeholder="Teléfono" value={clientData.phone}
                    onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                    className="border rounded p-2 w-full" />

                  {message && <p className="text-sm text-red-600">{message}</p>}
                  <button type="button" onClick={() => validateStep1() && handleNext()}
                    className="bg-indigo-600 text-white p-2 rounded mt-2 hover:bg-indigo-700 transition">
                    Siguiente
                  </button>
                </form>
              )}

              {step === 2 && (
                <form className="bg-white p-4 rounded-xl shadow-lg flex flex-col gap-3">
                  <h2 className="text-lg font-bold mb-2">Datos de Pago</h2>
                  <input type="number" placeholder="Monto" value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    className="border rounded p-2 w-full" />
                  <select value={period} onChange={(e) => setPeriod(e.target.value)}
                    className="border rounded p-2 w-full">
                    <option value="">Selecciona período</option>
                    <option value="monthly">Mensual</option>
                    <option value="quarterly">Trimestral</option>
                    <option value="yearly">Anual</option>
                  </select>

                  {message && <p className="text-sm text-red-600">{message}</p>}
                  <div className="flex justify-between">
                    <button type="button" onClick={handleBack}
                      className="bg-gray-400 text-white p-2 rounded hover:bg-gray-500 transition">
                      Atrás
                    </button>
                    <button type="button" onClick={() => validateStep2() && handleNext()}
                      className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition">
                      Siguiente
                    </button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={(e) => validateStep3() && handleSubmit(e)}
                  className="bg-white p-4 rounded-xl shadow-lg flex flex-col gap-3">
                  <h2 className="text-lg font-bold mb-2">Datos de la Tarjeta</h2>
                  <input type="text" placeholder="Número de tarjeta" value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="border rounded p-2 w-full" />
                  <input type="text" placeholder="Nombre del titular" value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border rounded p-2 w-full" />
                  <div className="flex gap-2">
                    <input type="text" placeholder="MM" value={expMonth}
                      onChange={(e) => setExpMonth(e.target.value)}
                      className="border rounded p-2 w-1/3" />
                    <input type="text" placeholder="YY" value={expYear}
                      onChange={(e) => setExpYear(e.target.value)}
                      className="border rounded p-2 w-1/3" />
                    <input type="text" placeholder="CVC" value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="border rounded p-2 w-1/3" />
                  </div>

                  {message && <p className="text-sm text-red-600">{message}</p>}
                  <div className="flex justify-between">
                    <button type="button" onClick={handleBack}
                      className="bg-gray-400 text-white p-2 rounded hover:bg-gray-500 transition">
                      Atrás
                    </button>
                    <button type="submit"
                      className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition">
                      Pagar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

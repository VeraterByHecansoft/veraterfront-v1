import { useAuthContext } from "@/auth";
import { formatearMonedaMXN } from "@/utils/Money";
import { TPreTrasfer } from "@rute/types";

interface RresumenTransaccionProps {
    resumen?: TPreTrasfer,
    onBack:()=>void,
    onAcept:()=>void
}
export const RresumenTransaccion = ({ resumen,onBack,onAcept}: RresumenTransaccionProps) => {
    const { user } = useAuthContext();
    return (
        <div className="max-w-md mx-auto">
            <h4 className="font-bold mb-2 text-center">Resumen de transferencia</h4>
            <div className="bg-gray-50 p-4 mb-4 rounded-lg">
                <div className="mb-3">
                    <span className="font-semibold">Origen:</span>
                    <p className="mt-1">{resumen?.nombreEmisor}</p>
                    {('admin' === user?.tipo || 'owner' ===user?.tipo)&&
                    <small className="mt-1">{resumen?.clabeOrigen}</small>}
                </div>
                <div className="mb-3">
                    <span className="font-semibold">Destino:</span>
                    <p className="mt-1">{resumen?.nombreReceptor}</p>
                    <small className="mt-1">{resumen?.CLABE}</small>
                </div>
                <div className="mb-3">
                    <span className="font-semibold">Importe:</span>
                    <p className="mt-1">{formatearMonedaMXN(parseFloat(resumen?.importe||'0.00'))}</p>
                </div>
                <div className="mb-3">
                    <span className="font-semibold">Concepto:</span>
                    <p className="mt-1 mt-1 text-sm">{resumen?.concepto}</p>
                </div>
                <div>
                    <span className="font-semibold">Referencia:</span>
                    <p className="mt-1 text-sm font-bold">{resumen?.referencia}</p>
                </div>
            </div>
            <div className="flex space-x-4">
                <button
                    onClick={onBack}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                    Volver
                </button>
                <button
                    onClick={onAcept}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                    Confirmar
                </button>
            </div>
        </div>
    )

}
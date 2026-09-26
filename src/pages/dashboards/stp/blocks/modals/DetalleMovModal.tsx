import { useAPIContext } from '@/auth/useAPIContext';
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { RootState } from '@/contexts/store';
import { STATUSTRANS, TIPOSTRANS } from '@/utils/Cosnts';
import { TBanco, TCEP, TMovTransaction } from '@rute/types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface movModalProps {
    open: boolean,
    title?: string;
    description?: string;
    onCancel?: () => void,
    mov?: TMovTransaction,
}

const DetalleMovModal = ({
    open,
    title = "Sin titulo",
    description,
    onCancel,
    mov
}: movModalProps) => {
    const { get } = useAPIContext();
    const [CEP, setCEP] = useState<TCEP | undefined>(undefined)
    const bancos = useSelector((state: RootState) => state.app.bancos as TBanco[]);
    console.log({mov})
    useEffect(() => {
        if (open && mov) {
            try {
                (async () => {
                    const tipoOrden = mov?.tipo == 'INGR' ? 'R' : 'E'
                    const rest = await get(`/stp/cep/${mov?.claveRastreo}/${tipoOrden}`) as any
                    if (rest?.data) {
                        setCEP(rest?.data)
                    }
                })()
            } catch (E) { /* empty */ }
        }
    }, [open])

    const handlerCancelar = () => {
        onCancel?.()
    }

    const getBanco = (clabe: string) => {
        const clave = clabe.slice(0, 3);
        if (bancos) {
            const BANCO = bancos.filter(b => b.clave === clave);
            if (BANCO[0]) return BANCO[0].nombre
        }
        return null
    }
    
    return <Dialog open={open} onOpenChange={handlerCancelar}>
        <DialogContent className="max-w-[500px]" aria-describedby='dialog'>
            <DialogHeader className="border-0">
                <DialogTitle>{title}</DialogTitle>
                {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
            <DialogBody className="flex flex-col items-center pt-10 pb-10">
                {mov && <div className="shadow-md rounded-xl p-5 w-full max-w-md mx-auto space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Movimiento
                        </h2>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${mov.tipo === 'INGR' || mov.tipo === 'SLIB' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {`${TIPOSTRANS[mov?.tipo] ? TIPOSTRANS[mov?.tipo] : mov?.tipo}`}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${mov.estatus === 'LQ' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {`${STATUSTRANS[mov?.estatus] ? STATUSTRANS[mov?.estatus] : mov?.estatus}`}
                        </span>
                    </div>
                    <div className="text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span className="font-medium">Fecha operación:</span>
                            <span>{mov.fecha} {mov.time}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Beneficiario:</span>
                            <span>{mov.nombreBeneficiario||mov.cbeneficiario}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Ordenante:</span>
                            <span>{mov.nombreOrdenante||mov.clabeordenante}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Clave rastreo:</span>
                            <span>{mov.claveRastreo}</span>
                        </div>

                        {mov?.claveRastreoDevolucion && <>
                            <div className="flex justify-between">
                                <span className="font-medium">Clave rastreo devolución:</span>
                                <span>{mov.claveRastreoDevolucion}</span>
                            </div>
                        </>}
                        <div className="flex justify-between">
                            <span className="font-medium">Referencia numérica:</span>
                            <span>{mov.referenciaNumerica||mov.referencia}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Concepto:</span>
                            <span>{mov.concepto}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Monto:</span>
                            <span className="text-right text-green-600 font-semibold">
                                ${mov.importe.toFixed(2)} MXN
                            </span>
                        </div>
                        {mov?.cuentaOrdenante && <>
                            <div className="flex justify-between">
                                <span className="font-medium">Cuenta Ordenante:</span>
                                <span>{mov.cuentaOrdenante}</span>
                            </div>
                        </>}
                        {mov?.institucionContraparte && <>
                            <div className="flex justify-between">
                                <span className="font-medium">Institución contraparte:</span>
                                <span>{` ${getBanco(mov?.cuentaOrdenante || '') || mov?.institucionContraparte}`}</span>
                            </div>

                        </>}

                        {mov?.cuentaBeneficiario && <>
                            <div className="flex justify-between">
                                <span className="font-medium">Cuenta Beneficiaria:</span>
                                <span>{mov.cuentaBeneficiario}</span>
                            </div>
                        </>}
                        {mov?.institucionOperante && <>
                            <div className="flex justify-between">
                                <span className="font-medium">Institución operante:</span>
                                <span>{` ${getBanco(mov.cuentaBeneficiario || '') || mov.institucionOperante}`}</span>
                            </div>
                        </>}
                        {CEP && <div className="w-full justify-between items-center p-2">
                            <a className='btn btn-primary'
                                target='_blank'
                                href={`${CEP?.urlCEP}`} >
                                descargar CEP
                            </a>
                        </div>}
                    </div>
                </div>}
            </DialogBody>
        </DialogContent>
    </Dialog>
}

export { DetalleMovModal }
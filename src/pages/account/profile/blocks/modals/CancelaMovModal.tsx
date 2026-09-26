import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@mui/base';
import { toAbsoluteUrl } from '@/utils';
import { AppDispatch, RootState } from '@/contexts/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAPIContext } from '@/auth/useAPIContext';

interface movModalProps {
    title?: string;
    description?: string;
    onAcept?: () => void,
    onCancel?: () => void,
    onResult?: (result: any) => void,
    data?: any,
    open: boolean
}
const getLabel = (estatus: string): string => {
    switch (estatus) {
        case 'LQ': return 'Liquidada';
        case 'PDT': return 'Pendiente';
        case 'CDO': return 'Por autorizar';
        case 'CDA': return 'Cancelada';
        default: return estatus;
    }
};


const CancelaMovModal = ({ open, title = "Sin titulo", description, onAcept, onCancel, onResult, data }: movModalProps) => {
    const authState = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>()
    const { put } = useAPIContext()

    useEffect(() => {
    }, [open])

    const handlerCancelar = () => {
        onCancel?.()
    }
    const handlerResult = () => {
        put('/stp/cancela', { iddoc: data.iddoc }).then((response: any) => {
            const data = response.data;
            onResult?.(data)
        });
    }

    const renderContent = (estatus: string) => {
        const label = getLabel(estatus)

        if (estatus === 'CDA') {
            return <p className="text-sm text-red-600 font-medium">La operación ya fue cancelada.</p>;
        }

        if (estatus === 'PDT') {
            return <p className="text-sm text-yellow-600">La operación está pendiente y no puede ser cancelada aún.</p>;
        }

        if (estatus === 'CDO') {
            return (
                <div className="flex flex-row gap-2">
                    <p className="text-sm text-gray-700">La operación está pendiente de autorización.</p>
                    <Button
                        onClick={handlerResult}
                        className="btn btn-secondary text-sm font-medium py-2"
                    >
                        Cancelar
                    </Button>
                </div>
            );
        }

        return <p className="text-sm text-gray-500">Estado: {label}</p>;
    };

    return <Dialog open={open} onOpenChange={handlerCancelar}>
        <DialogContent className="max-w-[500px]">
            <DialogHeader className="border-0">
                <DialogTitle>{title}</DialogTitle>
                {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
            <DialogBody className="flex flex-col items-center pt-10 pb-10">
                {renderContent(data?.estatus)}
            </DialogBody>
        </DialogContent>
    </Dialog>
}

export { CancelaMovModal }
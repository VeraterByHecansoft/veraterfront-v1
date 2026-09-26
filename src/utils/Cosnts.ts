import { TMovType } from "@rute/types";

export const TIPOSTRANS = {
    "INGR": "Ingreso",
    "EGRE": "Egreso",
    "TRAS": "Traspaso",
    "SLIB": "Saldo Liberado",
    "TERM": "Cobro con Terminal",
    "Dispersion": "Dispersión",
    "Pago": "Ingreso",
    "Compra": "Compra",
    "WITHDRAWAL": "Retiro",
    "PURCHASE": "Compra",
    "CLEARING": "Compra"
} as const;

export const STATUSTRANS = {
    'CDO': 'Pendiente por autorizar ℹ️',
    'LQ': 'Liquidada ✅',
    'CDA': 'Cancelada ❌',
    'PDT': 'Operación pendiente 🕛',
    'KNOWN': 'Desconocido ℹ️',
    'DECLINED': 'Declinada 🔴',
    "CLEARED": "Confirmada ✔️",
    "Aplicado": 'Aplicado ✔️'
} as const;

export const MOVTYPETEXT: Record<TMovType, string> = {
    INGR: "Ingreso",
    EGRE: "Egreso",
    TRAS: "Traspaso",
    TERM: "Terminado",
    SLIB: "Saldo inicial bloqueado",
    Dispersion: "Dispersión",
    Pago: "Pago",
    WITHDRAWAL: "Retiro",
    PURCHASE: "Compra"
};

export const MOVTYPECOLORS: Record<TMovType, string> = {
    INGR: "badge-success",
    EGRE: "badge-warning",
    TRAS: "badge-warning",
    TERM: "badge-warning",
    SLIB: "badge-success",
    Dispersion: "badge-success",
    Pago: "badge-success",
    WITHDRAWAL: "badge-warning",
    PURCHASE: "badge-warning"
};
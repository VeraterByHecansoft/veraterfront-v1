import React from 'react';
import Tippy from '@tippyjs/react';

interface DataItem {
    status: string;
    fecha: number;
    tTransa: number;
    params: any;
}

export interface ApiResponseCalentar {
    success: boolean;
    action: string;
    key: string;
    data: {
        diasEnMes: number;
        yyyy: number;
        mm: number;
        conDatos: DataItem[];
        sinDatos: DataItem[];
    };
}

interface CalendarProps {
    response: ApiResponseCalentar;
    onClickDate: (params: any) => void;
}
const obtenerDiaSemanaTexto = (year: number, month: number, day: number) => {
    const fecha = new Date(year, month - 1, day); // month - 1 porque Date usa 0-11
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return diasSemana[fecha.getDay()];
};
const CalendarOps: React.FC<CalendarProps> = ({ response, onClickDate }) => {
    if (response.data && response.success && response.data.conDatos) {
        const { yyyy, mm, conDatos, sinDatos, diasEnMes } = response.data;

        // Crear un map para saber si cada fecha tiene datos
        const dataMap: Record<number, 'success' | 'warning'> = {};
        conDatos.forEach(item => { dataMap[item.fecha] = 'success'; });
        sinDatos.forEach(item => { dataMap[item.fecha] = 'warning'; });

        // Fecha actual en formato yyyyMMdd
        const today = new Date();
        const todayNumber = today.getFullYear() * 10000 +
            (today.getMonth() + 1) * 100 +
            today.getDate();

        // Crear array de días del mes
        const days = Array.from({ length: diasEnMes }, (_, i) => i + 1);

        return (
            <div className="grid grid-cols-7 gap-2">
                {days.map(day => {
                    const fechaNumber = yyyy * 10000 + mm * 100 + day; // ej: 20260203
                    const status = dataMap[fechaNumber] || 'warning';
                    const item = [...conDatos, ...sinDatos].find(d => d.fecha === fechaNumber);

                    let params: false | { yyyy: number; mm: number; dd: number };
                    const fechaStr = item?.params?.fechaNatural?.toString();
                    let _yyyy = `????`; // Año
                    let _mm = `??`;     // Mes
                    let _dd = `??`;     // Día
                    if (fechaStr) {
                        _yyyy = fechaStr.slice(0, 4);
                        _mm = fechaStr.slice(4, 6);
                        _dd = fechaStr.slice(6, 8);
                        params = {
                            yyyy: parseInt(_yyyy),
                            mm: parseInt(_mm) - 1,
                            dd: parseInt(_dd)
                        };
                    } else {
                        params = false;
                    }

                    const isFuture = fechaNumber > todayNumber;

                    return (
                        <Tippy
                            key={fechaNumber}
                            content={`${day}/${mm}/${yyyy} - ${status === 'success' ? 'Con datos' : 'Sin datos'}`}
                            placement="right"
                        >
                            <div
                                key={fechaNumber}
                                className={`p-2 rounded border font-medium 
            ${status === 'success'
                                        ? 'bg-green-200 border-green-500 text-green-800'
                                        : 'bg-yellow-200 border-yellow-500 text-yellow-800'}
            ${isFuture ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {yyyy}/{_mm}/{_dd} <br />
                                <strong>{obtenerDiaSemanaTexto(yyyy, mm, parseInt(_dd))}</strong><br />
                                {item?.tTransa || 0} Operaciones<br />
                                <button className='btn btn-warning btn-xs'
                                    disabled={isFuture}
                                    onClick={() => !isFuture && item && onClickDate({ ...params, force: true })}
                                >Consulta STP</button><br />
                                <button className='btn btn-info btn-xs'
                                    disabled={isFuture}
                                    onClick={() => !isFuture && item && onClickDate({ ...params, force: false })}
                                >Consulta STP caché</button><br />
                            </div>
                        </Tippy>
                    );
                })}
                <Tippy key={'ALL-MESS'} content={'Consultar'} placement="right">
                    <button
                        className={`p-2 rounded border font-medium bg-blue-200 border-blue-500 text-blue-800`}
                        onClick={() => onClickDate(false)}
                    >
                        Consultar todo el Mes
                    </button>
                </Tippy>
            </div>
        );
    } else {
        return (
            <div className="grid grid-cols-7 gap-2">
                ERROR
            </div>
        );
    }
};

export default CalendarOps;

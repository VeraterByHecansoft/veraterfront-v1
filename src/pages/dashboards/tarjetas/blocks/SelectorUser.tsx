
import { TTransferRecept } from "@rute/types";
import { useEffect, useState } from "react";
 
interface SelectorUserPrps {
    selected?: any,
    items: any[],
    onSelect: (option: any) => void,
    dropdownRef?: React.RefObject<HTMLDivElement>
}
export const SelectorUser = ({ selected, items, onSelect, dropdownRef }: SelectorUserPrps) => {
    const [open, setOpen] = useState(false);
    const [query, onSearch] = useState('');
    // Filtrar cuentas basado en la búsqueda
    const filtrado = items.filter(cuenta =>
        cuenta.NOMBRE.toLowerCase().includes(query.toLowerCase())
    );

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef?.current &&
                event.target instanceof Node &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(()=>{
        if(selected?.value)
            setOpen(false)
    },[selected])

    return (<>
       {<div className="relative">
            <input
                type="text"
                value={query}
                onChange={(e) => {
                    onSearch(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder="Buscar cuenta..."
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>}
        {/* Opciones de cuentas incluyendo "Añadir cuenta" */}
        {open && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {filtrado.map((cuenta, index) => (
                    <div
                        key={index}
                        onClick={() => {
                            onSelect(cuenta);
                            setOpen(false);
                            onSearch('');
                        }}
                        className={`px-4 py-2 hover:bg-blue-100 cursor-pointer ${selected?.USR === cuenta.USR ? 'bg-blue-50 font-medium' : ''
                            }`}
                    >
                        <h5>{`${cuenta.NOMBRE} ${cuenta.APP} ${cuenta.APM}`}</h5>
                        <small>{cuenta.USR}</small>
                    </div>
                ))}
            </div>
        )}
        {/* Cuenta seleccionada */}
        {selected?.USR && !open && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200" onClick={()=>{setOpen(true)}}>
                <p className="text-gray-800">
                    <span>{`${selected.NOMBRE} ${selected.APP} ${selected.APM}`}</span><br/>
                    <small>{selected.USR}</small>

                </p>
            </div>
        )}
    </>
    )
}
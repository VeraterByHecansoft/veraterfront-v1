/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
import { useEffect, useState } from "react";

interface SelectorProps {
    selected?: any,
    items: any[],
    onSelect: (option: any) => void,
    dropdownRef?: React.RefObject<HTMLDivElement>
}
export const SelectorCLABERT = ({ selected, items, onSelect, dropdownRef }: SelectorProps) => {
    const [open, setOpen] = useState(false);
    const [query, onSearch] = useState('');
    // Filtrar cuentas basado en la búsqueda
    // Filtrar cuentas basado en la búsqueda
    console.log(selected)
    const filtrado = items.filter(cuenta =>
        cuenta.CLABE.toLowerCase().includes(query.toLowerCase())
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
        if(selected?.CLABE)
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
            <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
        </div>}
        {/* Opciones de cuentas incluyendo "Añadir cuenta" */}
        {open && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto top-[65px]">
                {filtrado.map((cuenta, index) => (
                    <div
                        key={index}
                        onClick={() => {
                            onSelect(cuenta);
                            setOpen(false);
                            onSearch('');
                        }}
                        className={`px-4 py-2 hover:bg-blue-100 cursor-pointer ${selected?.CLABE === cuenta.CLABE ? 'bg-blue-50 font-medium' : ''
                            }`}
                    >
                        <h5>{cuenta.CLABE} | {cuenta?.EMP} | {cuenta?.itnombre}</h5>
                    
                    </div>
                ))}
            </div>
        )}

        {/* Cuenta seleccionada */}
        {selected?.CLABE && !open && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200" onClick={()=>{setOpen(true)}}>
                <p className="text-gray-800">
                    <span>{selected.CLABE} {selected?.EMP} {selected?.itnombre}</span>
                </p>
            </div>
        )}
    </>
    )
}
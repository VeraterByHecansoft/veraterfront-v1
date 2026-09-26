import { TTransferRecept } from "@rute/types";
import { useEffect, useState } from "react";

interface SelectorReceptorProps {
    selected?: TTransferRecept,
    items: TTransferRecept[],
    onSelect: (option: TTransferRecept) => void,
    onAddNew: () => void,
    dropdownRef?: React.RefObject<HTMLDivElement>,
    isEditing:boolean,
    setIsEditing:React.Dispatch<React.SetStateAction<boolean>>
}
export const SelectorReceptor = ({isEditing, selected, items, setIsEditing, onSelect, onAddNew, dropdownRef }: SelectorReceptorProps) => {
    const [open, setOpen] = useState(false);
    const [query, onSearch] = useState('');
    // Filtrar cuentas basado en la búsqueda
    const filtrado = items.filter(cuenta =>
        cuenta.nombre.toLowerCase().includes(query.toLowerCase())
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
       {<div className="block">
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
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
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
                        <h5>{cuenta.label}</h5>
                        <small>{cuenta.nombre}</small>             
                    </div> 
                ))}
                <div
                    onClick={() => {
                        onAddNew();
                        setOpen(false);
                        setIsEditing(false)

                    }}
                    className="px-4 py-2 hover:bg-green-100 cursor-pointer border-t border-gray-200 text-green-600 font-semibold"
                >
                    + Añadir nueva cuenta
                </div>
            </div>
        )}

        {/* Cuenta seleccionada */}
        {selected?.CLABE && !open && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200" onClick={()=>{setOpen(true)}}>
                <p className="text-gray-800">
                    <span>{selected.label}</span><br/>
                    <small>{selected.nombre}</small>

                </p>
                <button onClick={() => {
                    onAddNew()
                    setOpen(false);
                    setIsEditing(true)

                  }}>
                <svg className="w-6 h-6 text-orange-800 dark:text-yellow-400" 
                    aria-hidden="true" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" viewBox="0 0 20 20"
                >
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.75 4H19M7.75 4a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 4h2.25m13.5 6H19m-2.25 0a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 10h11.25m-4.5 6H19M7.75 16a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 16h2.25"></path>
                </svg></button>            
            </div>
        )}

    </>
    )
}

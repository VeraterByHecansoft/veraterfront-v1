import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useAPIContext } from '@/auth/useAPIContext';
import { SelectorUser } from '../SelectorUser';
interface IModalProfileProps {
  open: boolean;
  onOpenChange: () => void;
  data?: any
}
const cuentas = [

]
const AsignarTarjetaModal = ({ open, onOpenChange, data }: IModalProfileProps) => {
  const { get, put } = useAPIContext();
  const parentRef = useRef<any | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [ClaveEmpleado, setClaveEmpleado] = useState<string | undefined>(undefined);
  const [NoTarjeta, setNoTarjeta] = useState<string | undefined>(undefined);
  const [Nombre, setNombre] = useState<string | undefined>(undefined);
  const [Paterno, setPaterno] = useState<string | undefined>(undefined);
  const [Materno, setMaterno] = useState<string | undefined>(undefined);
  const [Rfc, setRfc] = useState<string | undefined>(undefined);
  const [Curp, setCurp] = useState<string | undefined>(undefined);
  const [Nss, setNss] = useState<string | undefined>(undefined);
  const [usr, setUsr] = useState<string | undefined>(undefined);
  const [stpData, setStpData] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  // Referencia para el dropdown

  const mapeoNombres: Record<string, string> = {
    'ClaveEmpleado': 'Clave de empleado',
    'NoTarjeta': 'Número de tarjeta',
    'Nombre': 'Nombre',
    'Paterno': 'Apellido paterno',
    'Materno': 'Apellido materno',
    'Rfc': 'RFC',
    'Curp': 'CURP',
    'Nss': 'Número de seguro social (NSS)',
    'usr': 'Usuario'
  };

  const dropdownRef = useRef<HTMLDivElement>(null);
  function validarParamsObligatorios(params: any) {
    const obligatorios = [
      'ClaveEmpleado',
      'NoTarjeta',
      'Nombre',
      'Paterno',
      'Materno',
      'Rfc',
      'Curp',
      'Nss',
      'usr'
    ];

    const errores: string[] = [];

    obligatorios.forEach(key => {
      const valor = params[key];

      // Verificar existencia y valor no vacío después de trim
      if (valor === undefined || valor === null || String(valor).trim() === '') {
        errores.push(key); // Agregar campo a los errores
      }
    });

    return {
      success: errores.length === 0,
      errors: errores
    };
  }

  // Manejar envío del formulario de transferencia
  const handleSubmit = async (e: React.FormEvent) => {
    const params = {
      NoTarjeta,
      ClaveEmpleado,
      Nombre,
      Paterno,
      Materno,
      Rfc,
      Curp,
      Nss,
      usr
    }
    const resultado = validarParamsObligatorios(params);
    if (resultado.success) {
      setLoading(true)
      try {
        await put('tarjeta/asignar', params).then((response: any) => {
          const data = response?.data
          if (data.success) {
            toast(`Tarjeta Asignada`, {
              description: message,
              action: {
                label: 'Ok',
                onClick: () => {
                  onOpenChange()
                }
              }
            });
            setTimeout(() => {
              onOpenChange()
            }, 800)
          } else {
            setError(data.message)
          }
          setLoading(false);
        })

      } catch (err: any) {
        console.log(err)
        setLoading(false);
        setError(err?.message || 'Error al actualizar el correo');
        toast('Error de validación', {
          description: err?.message || 'Error al actualizar el correo',
          action: {
            label: 'Ok',
            onClick: () => onOpenChange()
          }
        });
      }
    } else {
      let message = '';
      if (resultado.errors.length === 1) {
        const campo = mapeoNombres[resultado.errors[0]] || resultado.errors[0];
        message = `El campo ${campo} es obligatorio.`;
      } else {
        const campos = resultado.errors.map(e => mapeoNombres[e] || e);
        const last = campos.pop();
        message = `Los campos ${campos.join(', ')} y ${last} son obligatorios.`;
      }

      // Mostrar toast
      toast('Error de validación', {
        description: message,
        action: {
          label: 'Ok',
          onClick: () => onOpenChange()
        }
      });
      setError(message);
    }
  }

  useEffect(() => {
    getMembers();
  }, [open])

  useEffect(() => {
    if (data?.NoTarjeta) {
      setNoTarjeta(data.NoTarjeta)
    }
  }, [data]);

  const getMembers = () => {
    get('/members')
      .then((response: any) => {
        if (response && response.data) {
          const data = response.data as []
          const RS = data.map((item: any) => {
            return {
              NOMBRE: item?.NOMBRE,
              APP: item?.APP,
              APM: item?.APM,
              USR: item?.USR,
            }
          })
          setStpData(RS);
        }
      })
      .catch((err) => {
        console.error('[STP] Error al cargar cuentas:', err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleSeletReceptor = (user: any) => {
    setSelectedUser(user);
    setUsr(user.USR)
    setNombre(user.NOMBRE);
    setPaterno(user.APP);
    setMaterno(user.APM);
  }

  return (
    <Dialog open={open} >
      <DialogContent className="max-w-[400px] max-h-[680px] p-2 overflow-hidden ">
        <DialogHeader className="p-0 border-0">
          <DialogTitle>Asignar Tarjeta</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DialogBody className="scrollable-y max-h-[600px]" ref={parentRef}>
          <div className="max-w-md mx-auto p-6  rounded-lg shadow-md">
            {error && (
              <span role="alert" className="text-danger text-xs mt-1">
                {error}
              </span>
            )}
            <form className='p-2 '>
              <div className="mb-4 relative" ref={dropdownRef}>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Usuario
                </label>
                <SelectorUser
                  dropdownRef={dropdownRef}
                  selected={selectedUser}
                  items={stpData}
                  onSelect={handleSeletReceptor} />
              </div>
              {/* Campo Clave de empleado */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Clave de empleado
                </label>
                <input
                  value={ClaveEmpleado}
                  onChange={(e) => { setClaveEmpleado(e.target.value) }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Clave de empleado"
                  required
                />
              </div>

              {/* Campo Nombre(s) */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nombre(s)
                </label>
                <input
                  type="text"
                  value={Nombre}
                  onChange={(e) => { setNombre(e.target.value) }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre(s)"
                  required
                />
              </div>
              {/* Campo Monto */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Apellido paterno
                </label>
                <input
                  type="text"
                  value={Paterno}
                  onChange={(e) => { setPaterno(e.target.value) }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Apellido paterno "
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Apellido materno
                </label>
                <input
                  type="text"
                  value={Materno}
                  onChange={(e) => { setMaterno(e.target.value) }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Apellido materno"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  RFC
                </label>
                <input
                  type="text"
                  value={Rfc}
                  onChange={(e) => { setRfc(e.target.value) }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="RFC"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  CURP
                </label>
                <input
                  type="text"
                  value={Curp}
                  onChange={(e) => { setCurp(e.target.value) }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="CURP"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  NSS
                </label>
                <input
                  type="text"
                  value={Nss}
                  onChange={(e) => { setNss(e.target.value) }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="NSS"
                  required
                />
              </div>
              {/* Botón Aceptar */}
              <div className="flex space-x-4">
                <button
                  disabled={loading}
                  type='button'
                  onClick={handleSubmit}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => { if (!loading) onOpenChange() }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { AsignarTarjetaModal };

import { DataGridColumnHeader, DataGridRowSelect, DataGridRowSelectAll } from '@/components';
import { Input } from '@/components/ui/input';
import { Menu, MenuItem, MenuToggle, MenuLink, MenuTitle, MenuSub, MenuIcon } from '@/components';
import { Column, ColumnDef } from '@tanstack/react-table';
import { ISTPMVC } from '@rute/types';
import { useMemo } from 'react';
import { formatearMonedaMXN } from '@/utils/Money';


interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

interface ColumnasProps {
  onView?: (data: any) => void,
}

const ColumnasMovs = ({ onView }: ColumnasProps) => {
  const ColumnInputFilter = <TData, TValue>({ column }: IColumnFilterProps<TData, TValue>) => {
    return (
      <Input
        placeholder="Filter..."
        value={(column.getFilterValue() as string) ?? ''}
        onChange={(event) => column.setFilterValue(event.target.value)}
        className="h-9 w-full max-w-40"
      />
    );
  };




  return useMemo<ColumnDef<ISTPMVC>[]>(
    () => [
      {
        accessorKey: 'id',
        header: () => <DataGridRowSelectAll />,
        cell: ({ row }) => <DataGridRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.idEF,
        id: 'idEF',
        header: ({ column }) => <DataGridColumnHeader title="idEF" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return (<div className="flex items-center gap-2.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-2sm text-gray-700 font-normal">
                {info.row.original.idEF}
              </span>
            </div>
          </div>)
        },
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.claveRastreo,
        id: 'claveRastreo',
        header: ({ column }) => <DataGridColumnHeader title="claveRastreo" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return (<div className="flex items-center gap-2.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-2sm text-gray-700 font-normal">
                {info.row.original.claveRastreo}
              </span>
            </div>
          </div>)
        },
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.claveRastreoDev,
        id: 'claveRastreoDev',
        header: ({ column }) => <DataGridColumnHeader title="claveRastreoDev" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return (
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col gap-0.5">
                <span className="text-2sm text-gray-700 font-normal">
                  {info.row.original.claveRastreoDev}
                </span>
              </div>
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.conceptoPago,
        id: 'conceptoPago',
        header: ({ column }) => <DataGridColumnHeader title="conceptoPago" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          const referencia = info.row.original.conceptoPago
          return (
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col gap-0.5">
                <span className="text-2sm text-gray-700 font-normal">
                  {referencia}
                </span>
              </div>
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.cuentaBeneficiario,
        id: 'cuentaBeneficiario',
        header: ({ column }) => <DataGridColumnHeader title="cuentaBeneficiario" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return (
            <div className={`badge badge-sm badge-outline`}>
              {info.row.original.cuentaBeneficiario}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.cuentaOrdenante,
        id: 'cuentaOrdenante',
        header: ({ column }) => <DataGridColumnHeader title="cuentaOrdenante" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return (
            <div className={`badge badge-sm badge-outline `}>
              {info.row.original.cuentaOrdenante}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.empresa,
        id: 'empresa',
        header: ({ column }) => <DataGridColumnHeader title="empresa" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return (
            <div className={`badge badge-sm badge-outline `}>
              {info.row.original.empresa}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.estado,
        id: 'estado',
        header: ({ column }) => <DataGridColumnHeader title="estado" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const estado = info.row.original.estado
          const color = estado == 'Liquidado' ? 'badge-success' : 'badge-warning';
          return (
            <div className={`badge badge-sm badge-outline ${color}`}>
              {estado}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.tipoOrden,
        id: 'tipoOrden',
        header: ({ column }) => <DataGridColumnHeader title="tipoOrden" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const tipoOrden = info.row.original.tipoOrden
          const color = tipoOrden == 'E' ? 'badge-warning' : 'badge-success'
          return (
            <div className={`badge badge-sm badge-outline ${color}`}>
              {tipoOrden == 'E' ? 'Egreso' : 'Ingreso'}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.fechaOperacion,
        id: 'fechaOperacion',
        header: ({ column }) => <DataGridColumnHeader title="fechaOperacion" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return (
            <div className={`badge badge-sm badge-outline `}>
              {info.row.original.fechaOperacion}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.fechaNatural,
        id: 'fechaNatural',
        header: ({ column }) => <DataGridColumnHeader title="fechaNatural" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return (
            <div className={`badge badge-sm badge-outline `}>
              {info.row.original.fechaNatural}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.institucionContraparte,
        id: 'institucionContraparte',
        header: ({ column }) => <DataGridColumnHeader title="institucionContraparte" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return (
            <div className={`badge badge-sm badge-outline `}>
              {info.row.original.institucionContraparte}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.institucionOperante,
        id: 'institucionOperante',
        header: ({ column }) => <DataGridColumnHeader title="institucionOperante" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return (
            <div className={`badge badge-sm badge-outline `}>
              {info.row.original.institucionOperante}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.monto,
        id: 'monto',
        header: ({ column }) => <DataGridColumnHeader title="monto" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return (
            <div className={`badge badge-sm badge-outline `}>
              {formatearMonedaMXN(info.row.original.monto)}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      },


      {
        accessorFn: (row) => row.nombreBeneficiario,
        id: 'nombreBeneficiario',
        header: ({ column }) => <DataGridColumnHeader title="nombreBeneficiario" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return (
            <div className={`badge badge-sm badge-outline `}>
              {info.row.original.nombreBeneficiario}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.nombreOrdenante,
        id: 'nombreOrdenante',
        header: ({ column }) => <DataGridColumnHeader title="nombreOrdenante" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return (
            <div className={`badge badge-sm badge-outline `}>
              {info.row.original.nombreOrdenante}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      },



      {
        accessorFn: (row) => row.nombreCep,
        id: 'nombreCep',
        header: ({ column }) => <DataGridColumnHeader title="nombreCep" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return (
            <div className={`badge badge-sm badge-outline `}>
              {info.row.original.nombreCep}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      },

    ],
    []
  );
}
export { ColumnasMovs }
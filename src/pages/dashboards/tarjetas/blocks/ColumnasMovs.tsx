
import { DataGridColumnHeader, DataGridRowSelect, DataGridRowSelectAll } from '@/components';
import { Input } from '@/components/ui/input';
import { Menu, MenuItem, MenuToggle, MenuLink, MenuTitle, MenuSub, MenuIcon } from '@/components';
import { Column, ColumnDef } from '@tanstack/react-table';
import { IDataIntecTCMov } from '@rute/types';
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
  return useMemo<ColumnDef<IDataIntecTCMov>[]>(
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
        accessorFn: (row) => row.fecha,
        id: 'fecha',
        header: ({ column }) => <DataGridColumnHeader title="Fecha" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return (<div className="flex items-center gap-2.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-2sm text-gray-700 font-normal">
                {info.row.original.fecha} : {info.row.original.time}
              </span>
            </div>
          </div>)
        },
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.time,
        id: 'time',
        header: ({ column }) => <DataGridColumnHeader title="Hora" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return (<div className="flex items-center gap-2.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-2sm text-gray-700 font-normal">
                {info.row.original.time}
              </span>
            </div>
          </div>)
        },
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.importe,
        id: 'importe',
        header: ({ column }) => <DataGridColumnHeader title="Importe" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const importe = info.row.original.importe
          return (
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col gap-0.5">
                <span className="text-2sm text-gray-700 font-normal">
                  {formatearMonedaMXN(importe)}
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
        accessorFn: (row) => row.referencia,
        id: 'referencia',
        header: ({ column }) => <DataGridColumnHeader title="No. Referencia" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          const referencia = info.row.original.referencia
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
        accessorFn: (row) => row.concepto,
        id: 'concepto',
        header: ({ column }) => <DataGridColumnHeader title="Concepto" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          const concepto = info.row.original.concepto
          return (
            <div className={`badge badge-sm badge-outline`}>
              {concepto}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      },

      {
        accessorFn: (row) => row.trxType,
        id: 'trxType',
        header: ({ column }) => <DataGridColumnHeader title="Tipo" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const trxType = info.row.original.trxType
          const color = trxType === 'Dispersion' ? 'badge-success' : 'badge-warning';

          return (
            <div className={`badge badge-sm badge-outline ${color}`}>
              {trxType}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      },

      {
        accessorFn: (row) => row.estatus,
        id: 'estatus',
        header: ({ column }) => <DataGridColumnHeader title="Estatus" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const estatus = info.row.original.estatus
          const trxStatus = info.row.original.trxStatus
          const color = estatus == 'Aplicado' ? 'badge-success' : 'badge-warning';
          return (
            <div className={`badge badge-sm badge-outline ${color}`}>
              {trxStatus}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      }
    ],
    []
  );
}
export { ColumnasMovs }
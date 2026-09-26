
import { DataGrid, DataGridColumnHeader, DataGridColumnVisibility, DataGridRowSelect, DataGridRowSelectAll, useDataGrid, CustomIcon } from '@/components';
import { Input } from '@/components/ui/input';
import { Menu, MenuItem, MenuToggle, MenuLink, MenuTitle, MenuSub, MenuIcon } from '@/components';
import { Column, ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { IDataMovStp, TMovType } from '@rute/types';
import { useMemo } from 'react';
import { formatearMonedaMXN } from '@/utils/Money';
import { MOVTYPECOLORS, MOVTYPETEXT } from '@/utils/Cosnts';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}
interface ColumnasProps {
  onView?: (data: any) => void,
  onCancel?: (data: any) => void,
  onDownload?: (data: any) => void,
  onAutorize?: (data: any) => void,
}
const ColumnasMovs = ({ onView, onCancel, onDownload, onAutorize }: ColumnasProps) => {
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
  return useMemo<ColumnDef<IDataMovStp>[]>(
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
        accessorFn: (row) => row.iddoc,
        id: 'iddoc',
        header: ({ column }) => <DataGridColumnHeader title="iddoc" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return (<div className="flex items-center gap-2.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-2sm text-gray-700 font-normal">
                {info.row.original.iddoc}
              </span>
            </div>
          </div>)
        },
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.tipo,
        id: 'tipo',
        header: ({ column }) => <DataGridColumnHeader title="tipo" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const tipo = info.row.original.tipo as TMovType
          const color = MOVTYPECOLORS[tipo] || 'badge-info';
          return (
            <div className={`badge badge-sm badge-outline ${color}`}>
              {`${MOVTYPETEXT[tipo] || tipo}`}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-[140px]',
        }
      },
      {
        accessorFn: (row) => row.fechCrea,
        id: 'fechCrea',
        header: ({ column }) => <DataGridColumnHeader title="fecha" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return `${info.row.original.fecha} : ${info.row.original.time}`
        },
        meta: {
          headerClassName: 'min-w-[170px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.concepto,
        id: 'concepto',
        header: ({ column }) => <DataGridColumnHeader title="concepto" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.concepto;
        },
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.cbeneficiario,
        id: 'cbeneficiario',
        header: ({ column }) => <DataGridColumnHeader title="cbeneficiario" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.cbeneficiario;
        },
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.importe,
        id: 'importe',
        header: ({ column }) => <DataGridColumnHeader title="importe" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return formatearMonedaMXN(info.row.original.importe);
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.saldo,
        id: 'saldo',
        header: ({ column }) => <DataGridColumnHeader title="saldo" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return formatearMonedaMXN(info.row.original.saldo);
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.estatus,
        id: 'estatus',
        header: ({ column }) => <DataGridColumnHeader title="estatus" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const estatus = info.row.original.estatus
          const color = estatus == 'LQ' ? 'badge-success text-success' :
            estatus == 'PDT' ? 'badge-warning text-warning' :
              estatus == 'CDO' ? 'badge-info text-info' :
                estatus == 'CDA' ? 'badge-warning text-warning' : estatus

          const label = estatus == 'LQ' ? 'Liquidada' :
            estatus == 'PDT' ? 'Pendiente' :
              estatus == 'CDO' ? 'Por autorizar' :
                estatus == 'CDA' ? 'Cancelada' : estatus
          return <span className={`badge badge-sm badge-light badge-outline ${color}`}>
            {label}
          </span>
        },
        meta: {
          headerClassName: 'min-w-[140px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        id: 'actions',
        header: () => '',
        enableSorting: false,
        cell: (info) => {
          return (
            <Menu className="items-stretch">
              <MenuItem
                toggle="dropdown"
                trigger="click"
                dropdownProps={{
                  placement: 'bottom-end',
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, 10] // [skid, distance]
                      }
                    }
                  ]
                }}
              >
                <MenuToggle className="text-gray-900 font-medium hover:link">
                  Más
                </MenuToggle>
                <MenuSub className="menu-default w-48 py-2">
                  <MenuItem onClick={() => { onView?.(info.row.original) }}>
                    <MenuLink>
                      <MenuTitle className="text-left text-gray-900 font-medium">Detalles</MenuTitle>
                      <MenuIcon>
                        <CustomIcon icon="shield-check" className="w-5 h-5" />
                      </MenuIcon>
                    </MenuLink>
                  </MenuItem>
                </MenuSub>
              </MenuItem>
            </Menu>
          );
        },
        meta: {
          headerClassName: 'w-[100px]'
        }
      },
    ],
    []
  );
}
export { ColumnasMovs }
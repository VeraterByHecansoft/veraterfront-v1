
import { DataGrid, DataGridColumnHeader, DataGridColumnVisibility, DataGridRowSelect, DataGridRowSelectAll, useDataGrid, CustomIcon } from '@/components';
import { Input } from '@/components/ui/input';
import { Menu, MenuItem, MenuToggle, MenuLink, MenuTitle, MenuSub, MenuIcon } from '@/components';
import { Column, ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { IDataConciliaSTP, TMovType } from '@rute/types';
import { useMemo } from 'react';
import { formatearMonedaMXN } from '@/utils/Money';
import { MOVTYPECOLORS, MOVTYPETEXT } from '@/utils/Cosnts';
import { Label } from 'recharts';
import { formatTimestamp } from '@/utils/Date';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}
interface ColumnasProps {
  onView?: (data: any) => void,
  onCancel?: (data: any) => void,
  onDownload?: (data: any) => void,
  onAutorize?: (data: any) => void,
}
const ColumnasMovsConcilia = ({ onView, onCancel, onDownload, onAutorize }: ColumnasProps) => {
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
  return useMemo<ColumnDef<IDataConciliaSTP>[]>(
    () => [
      {
        accessorKey: 'idEF',
        header: () => <DataGridRowSelectAll />,
        cell: ({ row }) => <DataGridRowSelect row={row} />,
        enableSorting: false,
        enableHiding: true,
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.claveRastreo,
        id: 'claveRastreo',
        header: ({ column }) => <DataGridColumnHeader title="claveRastreo" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return (
            <div className={`badge badge-sm badge-outline`}>
              {info.row.original.claveRastreo}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-[140px]',
        }
      },
      {
        accessorFn: (row) => row.tsCaptura,
        id: 'tsCaptura',
        header: ({ column }) => <DataGridColumnHeader title="tsCaptura" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return formatTimestamp(info.row.original.tsCaptura)
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.tsLiquidacion,
        id: 'tsLiquidacion',
        header: ({ column }) => <DataGridColumnHeader title="tsLiquidacion" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return formatTimestamp(info.row.original.tsLiquidacion)
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.claveRastreoDev,
        id: 'claveRastreoDev',
        header: ({ column }) => <DataGridColumnHeader title="claveRastreoDev" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return `${info.row.original.claveRastreoDev}`
        },
        meta: {
          headerClassName: 'min-w-[170px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.conceptoPago,
        id: 'conceptoPago',
        header: ({ column }) => <DataGridColumnHeader title="conceptoPago" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.conceptoPago;
        },
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.cuentaBeneficiario,
        id: 'cuentaBeneficiario',
        header: ({ column }) => <DataGridColumnHeader title="cuentaBeneficiario" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.cuentaBeneficiario;
        },
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.cuentaOrdenante,
        id: 'cuentaOrdenante',
        header: ({ column }) => <DataGridColumnHeader title="cuentaOrdenante" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.cuentaOrdenante;
          // return formatearMonedaMXN(info.row.original.importe);
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.empresa,
        id: 'empresa',
        header: ({ column }) => <DataGridColumnHeader title="empresa" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.empresa;
          // return formatearMonedaMXN(info.row.original.saldo);
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.estado,
        id: 'estado',
        header: ({ column }) => <DataGridColumnHeader title="estado" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const estado = info.row.original.estado
          const color = estado == 'Liquidado' ? 'badge-success text-success' : 'badge-warning text-warning'
          return <span className={`badge badge-sm badge-light badge-outline ${color}`}>
            {estado}
          </span>
        },
        meta: {
          headerClassName: 'min-w-[140px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.tipoOrden,
        id: 'tipoOrden',
        header: ({ column }) => <DataGridColumnHeader title="tipoOrden" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const estado = info.row.original.tipoOrden
          const color = estado == 'R' ? 'badge-success text-success' : 'badge-warning text-warning'
          const label = estado == 'R' ? 'Ingreso' : 'Egreso'
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
        accessorFn: (row) => row.fechaOperacion,
        id: 'fechaOperacion',
        header: ({ column }) => <DataGridColumnHeader title="fechaOperacion" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.fechaOperacion;
          // return formatearMonedaMXN(info.row.original.saldo);
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.fechaNatural,
        id: 'fechaNatural',
        header: ({ column }) => <DataGridColumnHeader title="fechaNatural" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.fechaNatural;
          // return formatearMonedaMXN(info.row.original.saldo);
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.institucionContraparte,
        id: 'institucionContraparte',
        header: ({ column }) => <DataGridColumnHeader title="institucionContraparte" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.institucionContraparte;
          // return formatearMonedaMXN(info.row.original.saldo);
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.institucionOperante,
        id: 'institucionOperante',
        header: ({ column }) => <DataGridColumnHeader title="institucionOperante" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.institucionOperante;
          // return formatearMonedaMXN(info.row.original.saldo);
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.monto,
        id: 'monto',
        header: ({ column }) => <DataGridColumnHeader title="monto" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          //return info.row.original.monto;
          return formatearMonedaMXN(info.row.original.monto);
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.nombreBeneficiario,
        id: 'nombreBeneficiario',
        header: ({ column }) => <DataGridColumnHeader title="nombreBeneficiario" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.nombreBeneficiario
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.nombreOrdenante,
        id: 'nombreOrdenante',
        header: ({ column }) => <DataGridColumnHeader title="nombreOrdenante" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.nombreOrdenante
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.nombreCep,
        id: 'nombreCep',
        header: ({ column }) => <DataGridColumnHeader title="nombreCep" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.nombreCep
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.rfcCep,
        id: 'rfcCep',
        header: ({ column }) => <DataGridColumnHeader title="rfcCep" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.rfcCep
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.referenciaNumerica,
        id: 'referenciaNumerica',
        header: ({ column }) => <DataGridColumnHeader title="referenciaNumerica" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.referenciaNumerica
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.rfcCurpBeneficiario,
        id: 'rfcCurpBeneficiario',
        header: ({ column }) => <DataGridColumnHeader title="rfcCurpBeneficiario" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.rfcCurpBeneficiario
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.rfcCurpOrdenante,
        id: 'rfcCurpOrdenante',
        header: ({ column }) => <DataGridColumnHeader title="rfcCurpOrdenante" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.rfcCurpOrdenante
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.tipoCuentaBeneficiario,
        id: 'tipoCuentaBeneficiario',
        header: ({ column }) => <DataGridColumnHeader title="tipoCuentaBeneficiario" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.tipoCuentaBeneficiario
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.tipoCuentaOrdenante,
        id: 'tipoCuentaOrdenante',
        header: ({ column }) => <DataGridColumnHeader title="tipoCuentaOrdenante" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.tipoCuentaOrdenante
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.tipoPago,
        id: 'tipoPago',
        header: ({ column }) => <DataGridColumnHeader title="tipoPago" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.tipoPago
        },
        meta: {
          headerClassName: 'min-w-[100px]',
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
                <MenuItem onClick={() => { onView?.(info.row.original) }}>
                  <MenuLink>
                    <MenuTitle className="text-left text-gray-900 font-medium">Empatar</MenuTitle>
                    <MenuIcon>
                      <CustomIcon icon="shield-check" className="w-5 h-5" />
                    </MenuIcon>
                  </MenuLink>
                </MenuItem>
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
export { ColumnasMovsConcilia }
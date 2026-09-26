
import { DataGrid, DataGridColumnHeader, DataGridColumnVisibility, DataGridRowSelect, DataGridRowSelectAll, useDataGrid, CustomIcon } from '@/components';
import { Input } from '@/components/ui/input';
import { Menu, MenuItem, MenuToggle, MenuLink, MenuTitle, MenuSub, MenuIcon } from '@/components';
import { Column, ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { IDataMovStp, TMovType } from '@rute/types';
import { useMemo } from 'react';
import { formatearMonedaMXN } from '@/utils/Money';
import { MOVTYPECOLORS, MOVTYPETEXT } from '@/utils/Cosnts';
import Tippy from '@tippyjs/react';
import { formatTimestamp } from '@/utils/Date';
import { IstpData } from './cuentas';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}
interface ColumnasProps {
  handleSelectAccount: (account: any) => void,
  handleSelectAccountMovs: (account: any) => void,
  handleDelAccount: (account: any) => void,
  handleSelectAddvirtualSaldo?: (account: any) => void,
  handleSelectTrasfiere?: (account: any) => void,
  handleSelectLiberaSaldoV?: (account: any) => void,
}
const ColumnasAccounts = ({ handleDelAccount, handleSelectAccount, handleSelectAccountMovs,  handleSelectAddvirtualSaldo, handleSelectTrasfiere,handleSelectLiberaSaldoV }: ColumnasProps) => {
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
  return useMemo<ColumnDef<IstpData>[]>(
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
        accessorFn: (row) => row.CLABE,
        id: 'CLABE',
        enableResizing: true,

        header: ({ column }) => <DataGridColumnHeader title="CLABE" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.CLABE;
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal',
        },

      },
      {
        accessorFn: (row) => row.maestra,
        id: 'maestra ',
        header: ({ column }) => <DataGridColumnHeader title="maestra " filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          const color = info.row.original.maestra == '1' ? 'badge-success' : 'badge-warning';
          const label = info.row.original.maestra == '1' ? 'Maestra' : 'Normal'
          return (
            <div className={`badge badge-sm badge-outline ${color}`}>
              {label}
            </div>
          );
        },
        meta: {
          headerClassName: 'min-w-[30px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.estado,
        id: 'estado',
        header: ({ column }) => <DataGridColumnHeader title="estado" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const color = info.row.original.estado == 'A' ? 'badge-success' : 'badge-warning';
          const label = info.row.original.estado == 'A' ? 'Activa' : 'Inactiva'
          return (
            <div className={`badge badge-sm badge-outline ${color}`}>
              {label}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-[70px]',
        }
      },
      {
        accessorFn: (row) => row.tipo,
        id: 'tipo',
        header: ({ column }) => <DataGridColumnHeader title="tipo" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const color = info.row.original.tipo == 'G' ? 'badge-success' : 'badge-warning';
          const label = info.row.original.tipo
          return (
            <div className={`badge badge-sm badge-outline ${color}`}>
              {label}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-[70px]',
        }
      },

      {
        accessorFn: (row) => row.entrada,
        id: 'entrada',
        header: ({ column }) => <DataGridColumnHeader hidden={true} title="entrada" column={column} />,
        enableSorting: true,
        hidden: true,
        cell: (info) => {
          const color = info.row.original.entrada === 0 ? 'badge-warning' :
            info.row.original.entrada === -1 ? 'badge-info' : 'badge-success';
          const label = info.row.original.entrada === 0 ? 'bloqueado' :
            info.row.original.entrada === -1 ? 'sinl imite' :
              `${formatearMonedaMXN(info.row.original.entrada || 0)}`;
          return (
            <div className={`badge badge-sm badge-outline ${color}`}>
              {label}
            </div>
          );
        },
        meta: {
          headerClassName: 'min-w-[90px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.salida,
        id: 'salida',
        header: ({ column }) => <DataGridColumnHeader hidden={true} title="salida" column={column} />,
        enableSorting: true,
        hidden: true,
        cell: (info) => {
          const color = info.row.original.salida === 0 ? 'badge-warning' :
            info.row.original.salida === -1 ? 'badge-info' : 'badge-success';
          const label = info.row.original.salida === 0 ? 'bloqueado' :
            info.row.original.salida === -1 ? 'sinl imite' :
              `${formatearMonedaMXN(info.row.original.salida || 0)}`;
          return (
            <div className={`badge badge-sm badge-outline ${color}`}>
              {label}
            </div>
          );
        },
        meta: {
          headerClassName: 'min-w-[90px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },


      {
        accessorFn: (row) => row.falta,
        id: 'falta',
        header: ({ column }) => <DataGridColumnHeader title="falta" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return `${formatTimestamp(info.row.original.falta || '')}`;
        },
        meta: {
          headerClassName: 'min-w-[80px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },

      {
        accessorFn: (row) => row.itnombre,
        id: 'Nombre del Usuario',
        header: ({ column }) => <DataGridColumnHeader title="Usuario" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.itnombre;
        },
        meta: {
          headerClassName: 'min-w-[50px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.divisa,
        id: 'divisa',
        header: ({ column }) => <DataGridColumnHeader title="divisa" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.divisa;
        },
        meta: {
          headerClassName: 'min-w-[80px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.saldo,
        id: 'saldo',
        header: ({ column }) => <DataGridColumnHeader title="saldo" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return `${formatearMonedaMXN(parseFloat(info.row.original.saldo) || 0)}`;
        },
        meta: {
          headerClassName: 'w-[80px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.saldoret,
        id: 'saldoret',
        header: ({ column }) => <DataGridColumnHeader title="Saldo retenido" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const label = `${formatearMonedaMXN(parseFloat(info.row.original.saldoret) || 0)}`;

          return (<>
            <span className="inline-flex items-center gap-1">
              {label}

              {(parseFloat(info.row.original.saldoret) > 0) && (
                <Tippy content={'Ver operaciones pendientes'} placement="right">
                  <span
                    className="badge badge-xs rounded-lg badge-outline relative -top-1 text-xs"
                  >
                    ?
                  </span>
                </Tippy>
              )}
            </span>
          </>
          )

        },
        meta: {
          headerClassName: 'w-[80px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },

      {
        accessorFn: (row) => row.Min_Ret,
        id: 'Min_Ret',
        header: ({ column }) => <DataGridColumnHeader title="Saldo Virtual" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const label = `${formatearMonedaMXN(parseFloat(info.row.original.Min_Ret || '0.0') || 0)}`;

          return (<>
            <span className="inline-flex items-center gap-1">
              {label}

              {(parseFloat(info.row.original.Min_Ret || '0.0') > 0) && (
                <Tippy content={'Ver operaciones pendientes'} placement="right">
                  <span
                    className="badge badge-xs rounded-lg badge-outline relative -top-1 text-xs"
                  >
                    ?
                  </span>
                </Tippy>
              )}
            </span>
          </>
          )

        },
        meta: {
          headerClassName: 'w-[80px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.saldoant,
        id: 'saldoant',
        header: ({ column }) => <DataGridColumnHeader title="Saldo anterior" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return `${formatearMonedaMXN(parseFloat(info.row.original.saldoant || '0') || 0)}`;
        },
        meta: {
          headerClassName: 'w-[80px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.LMTSAL,
        id: 'LMTSAL',
        header: ({ column }) => <DataGridColumnHeader hidden={true} title="Limite Mensual" column={column} />,
        enableSorting: true,
        visible: false,
        cell: (info) => {
          return `${formatearMonedaMXN(parseFloat(info.row.original.LMTSAL || '0') || 0)}`;
        },
        meta: {
          headerClassName: 'min-w-[50px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.LMTMOV,
        id: 'LMTMOV',
        header: ({ column }) => <DataGridColumnHeader hidden={true} title="Limite de movimiento" column={column} />,
        enableSorting: true,

        cell: (info) => {
          return `${formatearMonedaMXN(parseFloat(info.row.original.LMTMOV || '0') || 0)}`;
        },
        meta: {
          headerClassName: 'min-w-[120px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        id: 'actions',
        header: () => '',
        enableSorting: false,
        cell: (info) => {
          return (
            <>
              {(info.row.original.Min_Ret && (parseFloat(info.row.original.Min_Ret) || 0) > 0) &&
                handleSelectLiberaSaldoV && <button className="btn btn-link" onClick={() => { handleSelectLiberaSaldoV(info.row.original) }}>Liberar SaldoVirtual</button>
              }
              {/* <button className="btn btn-link" onClick={() => { handleSelectAccount(info.row.original) }}>Configurar</button> */}
              {handleSelectTrasfiere && <button className="btn btn-link" onClick={() => { handleSelectTrasfiere(info.row.original) }}>Transferir</button>}
              {handleSelectAddvirtualSaldo && <button className="btn btn-link" onClick={() => { handleSelectAddvirtualSaldo(info.row.original) }}>Saldo Virtual</button>}
              <button className="btn btn-link" onClick={() => { handleSelectAccountMovs(info.row.original) }}>Movimientos</button>
              <button className="btn btn-link" onClick={() => { handleDelAccount(info.row.original) }}>Archivar CLABE</button>

            </>
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
export { ColumnasAccounts }
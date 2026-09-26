
import { DataGridColumnHeader, DataGridRowSelect, DataGridRowSelectAll, useDataGrid, CustomIcon } from '@/components';
import { Input } from '@/components/ui/input';
import { Menu, MenuItem, MenuToggle, MenuLink, MenuTitle, MenuSub, MenuIcon } from '@/components';
import { Column, ColumnDef } from '@tanstack/react-table';
import { IDataIntecTC } from '@rute/types';
import { useMemo } from 'react';
import { Button } from '@mui/base';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}
interface ColumnasProps {
  onView?: (data: any) => void,
  onBlock?: (data: any) => void,
  onFondeo?: (data: any) => void,
  onEcomerce?: (data: any) => void,
  onAsign?: (data: any) => void, // asignar
}
const Columnas = ({ onView, onFondeo, onBlock, onEcomerce, onAsign }: ColumnasProps) => {
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


  // IsActiveEcommerce: boolean;
  // EstatusId: number;
  // Estatus: string;
  // ContactoId: mumber;
  return useMemo<ColumnDef<IDataIntecTC>[]>(
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
        accessorFn: (row, index) => `${row.id}`,
        id: 'TarjetaID',
        header: ({ column }) => <DataGridColumnHeader title="TarjetaID" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return (<div className="flex items-center gap-2.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-2sm text-gray-700 font-normal">
                {info.row.original.TarjetaID}
              </span>
            </div>
          </div>)
        },
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.ClienteID2,
        id: 'ClienteID2',
        header: ({ column }) => <DataGridColumnHeader title="ClienteID2" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return (<div className="flex items-center gap-2.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-2sm text-gray-700 font-normal">
                {info.row.original.ClienteID2}
              </span>
            </div>
          </div>)
        },
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.NoTarjeta,
        id: 'NoTarjeta',
        header: ({ column }) => <DataGridColumnHeader title="NoTarjeta" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          const NoTarjeta = info.row.original.NoTarjeta
          return (
            <div className={`badge badge-sm badge-outline`}>
              {NoTarjeta}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.ClaveEmpleado,
        id: 'ClaveEmpleado',
        header: ({ column }) => <DataGridColumnHeader title="ClaveEmpleado" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          const ClaveEmpleado = info.row.original.ClaveEmpleado
          return (
            <div className={`badge badge-sm badge-outline`}>
              {ClaveEmpleado}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.NombreTH,
        id: 'NombreTH',
        header: ({ column }) => <DataGridColumnHeader title="NombreTH" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          const NombreTH = info.row.original.NombreTH
          return (
            <div className={`badge badge-sm badge-outline`}>
              {NombreTH}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.ProductoNombre,
        id: 'ProductoNombre',
        header: ({ column }) => <DataGridColumnHeader title="ProductoNombre" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const ProductoNombre = info.row.original.ProductoNombre
          return (
            <div className={`badge badge-sm badge-outline`}>
              {ProductoNombre}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.IsActiveEcommerce,
        id: 'IsActiveEcommerce',
        header: ({ column }) => <DataGridColumnHeader title="IsActiveEcommerce" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const IsActiveEcommerce = info.row.original.ProductoNombre
          const status = info.row.original.IsActiveEcommerce
          const color = status ? 'badge-success' : 'badge-warning';
          const label = status ? 'Activo' : 'Innactivo'
          return (
            <div className={`badge badge-sm badge-outline ${color}`}>
              {label}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.EstatusId,
        id: 'EstatusId',
        header: ({ column }) => <DataGridColumnHeader title="EstatusId" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const EstatusId = info.row.original.EstatusId
          const Estatus = info.row.original.Estatus
          const color = EstatusId == 9 ? 'badge-success' : 'badge-warning';
          return (
            <div className={`badge badge-sm badge-outline ${color}`}>
              {Estatus}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      },

      {
        accessorFn: (row) => row.ContactoId,
        id: 'ContactoId',
        header: ({ column }) => <DataGridColumnHeader title="ContactoId" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const ContactoId = info.row.original.ContactoId
          return (
            <div className={`badge badge-sm badge-outline`}>
              {ContactoId}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-0'
        }
      },


      {
        id: 'actions',
        header: () => '',
        enableSorting: false,
        cell: (info) => {
          const EstatusId = info.row.original.EstatusId
          return (<>
            {EstatusId == 9 ?
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
                    <MenuItem onClick={() => { onEcomerce?.(info.row.original) }}>
                      <MenuLink>
                        <MenuTitle className="text-left text-gray-900 font-medium">Eccomerce</MenuTitle>
                        <MenuIcon>
                          <CustomIcon icon="shopping-bag" className="w-5 h-5" />
                        </MenuIcon>
                      </MenuLink>
                    </MenuItem>
                    <MenuItem onClick={() => { onFondeo?.(info.row.original) }}>
                      <MenuLink>
                        <MenuTitle className="text-left text-gray-900 font-medium">Fondear</MenuTitle>
                        <MenuIcon>
                          <CustomIcon icon="archive-box-arrow-down" className="w-5 h-5" />
                        </MenuIcon>
                      </MenuLink>
                    </MenuItem>
                    <MenuItem onClick={() => { onBlock?.(info.row.original) }}>
                      <MenuLink>
                        <MenuTitle className="text-left text-gray-900 font-medium">Bloquear</MenuTitle>
                        <MenuIcon>
                          <CustomIcon icon="no-symbol" className="w-5 h-5" />
                        </MenuIcon>
                      </MenuLink>
                    </MenuItem>
                    <MenuItem onClick={() => { onView?.(info.row.original) }}>
                      <MenuLink>
                        <MenuTitle className="text-left text-gray-900 font-medium">Ver Movimientos</MenuTitle>
                        <MenuIcon>
                          <CustomIcon icon="queue-list" className="w-5 h-5" />
                        </MenuIcon>
                      </MenuLink>
                    </MenuItem>
                  </MenuSub>
                </MenuItem>
              </Menu> :
              <>
                <Button
                  onClick={() => { onAsign?.(info.row.original)}}
                  className={`btn btn-info btn-xs text-white`}
                ><CustomIcon icon="check-circle" className="w-5 h-5" /> Asignar</Button>
              </>
            }</>
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
export { Columnas }
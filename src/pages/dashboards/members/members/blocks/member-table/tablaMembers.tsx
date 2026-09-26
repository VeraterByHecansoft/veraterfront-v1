/* eslint-disable prettier/prettier */
import { useEffect, useMemo, useState } from 'react';
import { Column, ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { DataGrid, DataGridColumnHeader, DataGridColumnVisibility, DataGridRowSelect, DataGridRowSelectAll, useDataGrid, CustomIcon } from '@/components';
import { Menu, MenuItem, MenuToggle, MenuLink, MenuTitle, MenuSub, MenuIcon } from '@/components';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { useAPIContext } from '@/auth/useAPIContext';
import { TDataModelPERFIL } from '../utils/dataModels';
import { SkeletonTable } from '../utils/SkeletonTable';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/utils';
interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

interface TablaMembersProps {
  triger?: string,
  onEdit?: (user: any) => void,
  onBlock?: (user: any) => void,
  onInvite?: (user: any) => void,
}

const TablaMembers = ({ triger, onEdit, onBlock, onInvite }: TablaMembersProps) => {
  const { get } = useAPIContext();
  const [stpData, setStpData] = useState<TDataModelPERFIL[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMembers();
  }, []);

  useEffect(() => {
    if (triger === 'load') {
      getMembers();
    }
  }, [triger])

  const getMembers = () => {
    get('/members')
      .then((response: any) => {
        if (response && response.data) {
          setStpData(response.data);
        }
      })
      .catch((err) => {
        console.error('[STP] Error al cargar cuentas:', err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

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

  const columns = useMemo<ColumnDef<TDataModelPERFIL>[]>(
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
        accessorFn: (row) => row.nombres,
        id: 'nombres',
        header: ({ column }) => <DataGridColumnHeader title="nombres" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          const avatar = info.row.original?.imgperf ? `https://rute.mx/D?u=${info.row.original.imgperf}&t=1` : toAbsoluteUrl(`/media/avatars/${'blank.png'}`)
          return (<div className="flex items-center gap-2.5">
            <div className="shrink-0">
              <img
                src={avatar}
                className="h-9 rounded-full"
                alt={info.row.original.nombres}
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <Link className="leading-none font-medium text-sm text-gray-900 hover:text-primary" to={`/member/${info.row.original.USR}`}>
                {info.row.original.nombres}
              </Link>
              <span className="text-2sm text-gray-700 font-normal">
                {info.row.original.tipo}
              </span>
            </div>
          </div>)
        },
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.tipo,
        id: 'tipo',
        header: ({ column }) => <DataGridColumnHeader title="tipo" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const color = info.row.original.tipo == 'admin' ? 'badge-success' : 'badge-warning';
          const label = info.row.original.tipo == 'admin' ? 'Administrador' : 'Miembro'
          return (
            <div className={`badge badge-sm badge-outline ${color}`}>
              {label}
            </div>
          );
        },
        meta: {
          headerClassName: 'w-[170px]',
        }
      },

      {
        accessorFn: (row) => row.email,
        id: 'email',
        header: ({ column }) => <DataGridColumnHeader title="email" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.email;
        },
        meta: {
          headerClassName: 'min-w-[170px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.CLABE,
        id: 'CLABE',
        header: ({ column }) => <DataGridColumnHeader title="CLABE" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.CLABE;
        },
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.estatus,
        id: 'estatus',
        header: ({ column }) => <DataGridColumnHeader title="estatus" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return <>
            {info.row.original.estatus === '1' ?
              <span className="badge badge-sm badge-light badge-outline text-success">
                Activo
              </span>
              : info.row.original.estatus === '0' ?
                <span className="badge badge-sm badge-light badge-outline text-danger">
                  Inactivo
                </span> :
                <span className="badge badge-sm badge-light badge-outline text-warning">
                  Known
                </span>
            }
          </>
        },
        meta: {
          headerClassName: 'min-w-[170px]',
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
                  <MenuItem onClick={() => { onEdit?.(info.row.original) }}>
                    <MenuLink>
                      <MenuTitle className="text-left text-gray-900 font-medium">Editar</MenuTitle>
                      <MenuIcon>
                        <CustomIcon icon="pencil" className="w-5 h-5" />
                      </MenuIcon>
                    </MenuLink>
                  </MenuItem>
                  <MenuItem onClick={() => { onBlock?.(info.row.original) }}>
                    <MenuLink >
                      <MenuTitle className="text-left text-gray-900 font-medium">Bloquear</MenuTitle>
                      <MenuIcon>
                        <CustomIcon icon="no-symbol" className="w-5 h-5" />
                      </MenuIcon>
                    </MenuLink>
                  </MenuItem>
                  <MenuItem onClick={() => { onInvite?.(info.row.original) }}>
                    <MenuLink >
                      <MenuTitle className="text-left text-gray-900 font-medium">Reenviar Activación</MenuTitle>
                      <MenuIcon>
                        <CustomIcon icon="no-symbol" className="w-5 h-5" />
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

  const handleRowSelection = (state: RowSelectionState) => {
    const selectedRowIds = Object.keys(state);

    if (selectedRowIds.length > 0) {
      toast(`Total ${selectedRowIds.length} are selected.`, {
        description: `Selected row IDs: ${selectedRowIds}`,
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo')
        }
      });
    }
  };

  const Toolbar = () => {
    const { table } = useDataGrid();
    return (
      <div className="card-header border-b-0 px-5 flex-wrap">
        <h3 className="card-title">Cuentas de miembros</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <DataGridColumnVisibility table={table} />
        </div>
      </div>
    );
  };
  
  if (loading) {
    return <SkeletonTable />;
  }

  return (
    <DataGrid
      columns={columns}
      data={stpData}
      rowSelection={true}
      onRowSelectionChange={handleRowSelection}
      pagination={{ size: 5 }}
      sorting={[{ id: 'nombres', desc: false }]}
      toolbar={<Toolbar />}
      layout={{ card: true }}
    />
  );
};

export { TablaMembers };

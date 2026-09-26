/* eslint-disable prettier/prettier */
import { useEffect, useMemo, useState } from 'react';
import { Column, ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { DataGrid, DataGridColumnHeader, DataGridColumnVisibility, DataGridRowSelect, DataGridRowSelectAll, useDataGrid, CustomIcon } from '@/components';
import { IstpData, SkeletonTable } from '.';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { useAPIContext } from '@/auth/useAPIContext';
import { formatearMonedaMXN } from '@/utils/Money';
import { formatTimestamp } from '@/utils/Date';
import ModalCargoRecurrente from '../ModalCargoRecurrente';
import ModalPago from '../ModalPago';
import { position } from 'stylis';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

const TablaCobros = () => {
  const { get, post } = useAPIContext();
  const [stpData, setStpData] = useState<IstpData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOp, setModalOp] = useState(false);
  const [modalPago, setModalPago] = useState(false);
  const [selected, setSelected] = useState<any | undefined>(undefined);

  useEffect(() => {
    loadCobros()
  }, []);


  const loadCobros = () => {
    get('/pay/cobros')
      .then((response: any) => {
        if (response && response.data) {
          const data = response.data as any[];
          data.map((e) => {
            return { ...e }
          })
          setStpData(response.data);
        }
      })
      .catch((err) => {
        toast.error(err.message || 'Error al cargar las cuentas')
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

  const handleSelectAccount = (account: any) => {
    setSelected(account);
    setModalPago(true)
  }

  const columns = useMemo<ColumnDef<IstpData>[]>(
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
         accessorFn: (row) => row.Frec_mens,
         id: 'estado',
         header: ({ column }) => <DataGridColumnHeader title="estado" column={column} />,
       enableSorting: true,
         cell: (info) => {
           const color = '';
           return (
             <div className={`badge badge-sm badge-outline ${color}`}>
               {info.row.original.description}
             </div>
           );
         },
         meta: {
         headerClassName: 'w-[70px]',
         }
       },

      {
        accessorFn: (row) => row.Frec_mens,
        id: 'Frec_mens',
        header: ({ column }) => <DataGridColumnHeader hidden={true} title="Frec_mens" column={column} />,
        enableSorting: true,
        hidden: true,
        cell: (info) => {
          const color = info.row.original.Frec_mens
          return (
            <div className={`badge badge-sm badge-outline`}>
              {info.row.original.Frec_mens}
            </div>
          );
        },
        meta: {
          headerClassName: 'min-w-[90px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },


      {
        accessorFn: (row) => row.fechCrea,
        id: 'fechCrea',
        header: ({ column }) => <DataGridColumnHeader title="fechCrea" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return `${formatTimestamp(info.row.original.fechCrea || '')}`;
        },
        meta: {
          headerClassName: 'min-w-[80px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.fechAplic,
        id: 'fechAplic',
        header: ({ column }) => <DataGridColumnHeader title="fechAplic" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return `${formatTimestamp(info.row.original.fechAplic || '')}`;
        },
        meta: {
          headerClassName: 'min-w-[80px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.fec_ult_cargo,
        id: 'fec_ult_cargo',
        header: ({ column }) => <DataGridColumnHeader title="fec_ult_cargo" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return `${formatTimestamp(info.row.original.fec_ult_cargo || '')}`;
        },
        meta: {
          headerClassName: 'min-w-[80px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },

      {
        accessorFn: (row) => row.Dia_cargo,
        id: 'Dia_cargo',
        header: ({ column }) => <DataGridColumnHeader title="Dia_cargo" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.Dia_cargo;
        },
        meta: {
          headerClassName: 'min-w-[50px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      // {
      //   accessorFn: (row) => row.divisa,
      //   id: 'divisa',
      //   header: ({ column }) => <DataGridColumnHeader title="divisa" column={column} />,
      //   enableSorting: true,
      //   cell: (info) => {
      //     return info.row.original.divisa;
      //   },
      //   meta: {
      //     headerClassName: 'min-w-[80px]',
      //     cellClassName: 'text-gray-800 font-normal',
      //   }
      // },
      {
        accessorFn: (row) => row.importe,
        id: 'importe',
        header: ({ column }) => <DataGridColumnHeader title="importe" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return `${formatearMonedaMXN(parseFloat(info.row.original.importe) || 0)}`;
        },
        meta: {
          headerClassName: 'w-[80px]',
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
              <button className="btn btn-link" onClick={() => { handleSelectAccount(info.row.original) }}>Realizar Cobro</button>
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

  const gethook = async () => {
    get('/pay/hooks', {})
      .then((response: any) => {
        console.log(response)
      })
      .catch((err) => {
        toast.error(err.message || 'Error al cargar las cuentas')
      })
      .finally(() => {
        setLoading(false);
      });

  }
  const Toolbar = () => {
    const { table } = useDataGrid();
    const isFiltered = table.getState().columnFilters.length > 0

    return (
      <div className="card-header border-b-0 px-5 flex-wrap">
        <h3 className="card-title">Cuentas STP</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl shadow-md">
            <div className="flex items-center gap-2">
              <button className="btn btn-light btn-sm"
                onClick={() => { setModalOp(true) }}
              >
                <CustomIcon icon="exit-down" />
                Crear Cobro
              </button>
              {/* <button className="btn btn-light btn-sm"
                onClick={() => { gethook() }}
              >
                <CustomIcon icon="exit-down" />
                crea hook
              </button> */}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <DataGridColumnVisibility table={table} />
        </div>
      </div>
    );
  };

  if (loading) {
    return <SkeletonTable />;
  }

  const handleOpe = (refresh: boolean) => {
    setModalOp(false);
    if (refresh) {
      loadCobros();
    }
  }

  return (
    <>
      <DataGrid
        columns={columns}
        columnVisibility={
          {
            LMTMOV: false,
            LMTSAL: false,
            tipo: false
          }
        }
        data={stpData}
        rowSelection={true}
        onRowSelectionChange={handleRowSelection}
        pagination={{ size: 100 }}
        sorting={[{ id: 'fechCrea', desc: true }]}
        toolbar={<Toolbar />}
        layout={{ card: true }}

      />
      <ModalCargoRecurrente open={modalOp} onOpenChange={handleOpe} />
      <ModalPago open={modalPago} onOpenChange={(r: boolean) => { setModalPago(false) }} selected={selected} />
    </>
  );
};

export { TablaCobros };


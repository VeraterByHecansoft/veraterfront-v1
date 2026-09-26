import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Column, ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import {
  DataGrid,
  TDataGridRequestParams,
  CustomIcon,
  DataGridRowSelect,
  DataGridRowSelectAll,
  DataGridColumnHeader,
  useDataGrid
} from '@/components';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { useAPIContext } from '@/auth/useAPIContext';
import { formatIsoDate } from '@/utils/Date';
import { TInventory } from '../../product/blocks/products/teams-types';

interface IModaleProps {
  open: boolean;
  onOpenChange: () => void;
}

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}
const AllInventoriesModal = ({ open, onOpenChange }: IModaleProps) => {
  const { get, processResponseDirect } = useAPIContext()
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);



  const ColumnFilter = <TData, TValue>({ column }: IColumnFilterProps<TData, TValue>) => {
    const [inputValue, setInputValue] = useState((column.getFilterValue() as string) ?? '');

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        column.setFilterValue(inputValue); // Apply the filter only on Enter
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value); // Update local state
    };

    return (
      <Input
        placeholder="Filter..."
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown} // Trigger filter on Enter key
        className="h-9 w-full max-w-40"
      />
    );
  };

  const columns = useMemo<ColumnDef<TInventory>[]>(
    () => [
      {
        accessorKey: 'id',
        accessorFn: (row) => row.id,
        header: () => <DataGridRowSelectAll />,
        cell: ({ row }) => <DataGridRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.product,
        id: 'name',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Producto"
            filter={<ColumnFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => (
          <div className="flex flex-col gap-2">
            <Link
              className="leading-none font-medium text-sm text-gray-900 hover:text-primary"
              to="#"  >
              {info.row.original.product}/{info.row.original?.sku}
            </Link>
            {/* <span className="text-2sm text-gray-700 font-normal leading-3">
              {info.row.original.description}
            </span> */}
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[280px]'
        }
      },
      {
        accessorFn: (row) => row.warehouse,
        id: 'rating',
        header: ({ column }) => <DataGridColumnHeader
          title="warehouse"
          filter={<ColumnFilter column={column} />}
          column={column}
        />,
        enableSorting: true,
        cell: (info) => (
          <span className="text-2sm text-gray-700 font-normal leading-3">
            {info.row.original.warehouse}
          </span>
        ),
        meta: {
          className: 'min-w-[135px]'
        }
      },
      {
        accessorFn: (row) => row.quantity,
        id: 'Cantidad',
        enableSorting: true,
        enableHiding: false,
        header: ({ column }) => <DataGridColumnHeader title="Ultima Actualización" column={column} />,
        cell: (info) => (
          <span className="text-2sm text-gray-700 font-normal leading-3">
            {info.row.original.quantity}
          </span>
        ),
        meta: {
          className: 'min-w-[135px]'
        }
      },
      {
        accessorFn: (row) => row.minStock,
        id: 'minStock',
        enableSorting: true,
        enableHiding: false,
        header: ({ column }) => <DataGridColumnHeader title="Existencias" column={column} />,
        cell: (info) => (
          <span className="text-2sm text-gray-700 font-normal leading-3">
            {info.row.original.minStock}
          </span>
        ),
        meta: {
          className: 'min-w-[135px]'
        }
      },
      {
        accessorFn: (row) => row.maxStock,
        id: 'maxStock',
        enableSorting: true,
        enableHiding: false,
        header: ({ column }) => <DataGridColumnHeader title="Ultima Actualización" column={column} />,

        cell: (info) => (
          <span className="text-2sm text-gray-700 font-normal leading-3">
            {info.row.original.maxStock}
          </span>
        ),
        meta: {
          className: 'min-w-[135px]'
        }
      },
      {
        accessorFn: (row) => row.lastUpdate,
        id: 'Última Actualización',
        enableSorting: true,
        enableHiding: false,
        header: ({ column }) => <DataGridColumnHeader title="Existencias" column={column} />,
        cell: (info) => formatIsoDate(info.row.original.lastUpdate),
        meta: {
          className: 'min-w-[135px]'
        }
      }
    ],
    []
  );

  const [searchQuery, setSearchQuery] = useState('');

  const fetchInventories = async (params: TDataGridRequestParams) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.set('page', String(params.pageIndex + 1)); // Page is 1-indexed on server
      queryParams.set('items_per_page', String(params.pageSize));
      if (params.sorting?.[0]?.id) {
        queryParams.set('sort', params.sorting[0].id);
        queryParams.set('order', params.sorting[0].desc ? 'desc' : 'asc');
      }
      if (searchQuery.trim().length > 0) {
        queryParams.set('query', searchQuery);
      }
      // Column filters
      if (params.columnFilters) {
        params.columnFilters.forEach(({ id, value }) => {
          if (value !== undefined && value !== null) {
            queryParams.set(`filter[${id}]`, String(value)); // Properly serialize filter values
          }
        });
      }
      const response = await get('inventory', `${queryParams.toString()}`);
      const data = await processResponseDirect({ response });

      if (data.data) {
        return {
          data: data.data.results,
          totalCount: data.data.totalRecords
        };
      }
      return {
        data: [],// response.data.data, // Server response data
        totalCount: 0,//response.data.pagination.total // Total count for pagination
      };
    } catch (error) {
      toast(`Connection Error`, {
        description: `An error occurred while fetching data. Please try again later`,
        action: {
          label: 'Ok',
          onClick: () => console.log('Ok')
        }
      });

      return {
        data: [],
        totalCount: 0
      };
    }
  };
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
  const Toolbar = ({ setSearchQuery }: { setSearchQuery: (query: string) => void }) => {
    const [inputValue, setInputValue] = useState(searchQuery);
    const { table } = useDataGrid();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        setSearchQuery(inputValue);
        if (inputValue.trim() === '') {
          // Remove the 'query' filter if input is empty
          table.setColumnFilters(
            table.getState().columnFilters.filter((filter) => filter.id !== 'query') // Exclude the filter with id 'query'
          );
        } else {
          // Add or update the 'query' filter
          table.setColumnFilters([
            ...table.getState().columnFilters.filter((filter) => filter.id !== 'query'), // Remove existing 'query' filter
            { id: 'query', value: inputValue }, // Add the new filter
          ]);
        }
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value); // Update local state
    };

    return (
      <div className="card-header border-b-0 px-5">
        <DialogHeader className="p-0 border-0">
          <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5">
            <div className="flex flex-col justify-center gap-2">
              <DialogTitle>Todos los inventarios</DialogTitle>
              <DialogDescription>Agregar una nueva </DialogDescription>
            </div>

          </div>
        </DialogHeader>
        <div className="input input-sm max-w-48">
          <CustomIcon icon="magnifier" />
          <input
            type="text"
            placeholder="Buscar un producto"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button className="btn btn-sm btn-light" onClick={!saving ? onOpenChange : () => { }}>
          Cerrar
        </button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="container-fixed max-w-[auto] flex flex-col p-10 overflow-hidden [&>button]:hidden">
        <DialogBody className="scrollable-y py-0 mb-5 ps-0 pe-3 -me-7" >
          <DataGrid
            columns={columns}
            serverSide={true}
            onFetchData={fetchInventories}
            rowSelection={true}
            getRowId={(row: any) => row.id}
            onRowSelectionChange={handleRowSelection}
            pagination={{ size: 5 }}
            toolbar={<Toolbar setSearchQuery={setSearchQuery} />}
            layout={{ card: true }}
          />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { AllInventoriesModal };

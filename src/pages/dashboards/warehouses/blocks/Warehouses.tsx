
import React, { Fragment, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle, XCircle } from 'lucide-react';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import {
  DataGrid,
  TDataGridRequestParams,
  CustomIcon,
  DataGridRowSelect,
  DataGridRowSelectAll,
  DataGridColumnHeader,
  useDataGrid,
  IColumnFilterProps
} from '@/components';
import { formatIsoDate } from '@/utils/Date';
import { Input } from '@/components/ui/input';
import { useAPIContext } from '@/auth/useAPIContext';
import { TWarehouse } from './types';

export default function Warehouses() {
    const {get,processResponseDirect} = useAPIContext();
    const [searchQuery, setSearchQuery] = useState('');

    const fetchWharehouses = async (params: TDataGridRequestParams) => {
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
        const response = await get('warehouse',`${queryParams.toString()}`);
        const data =await processResponseDirect ({ response});
        if(data.results){
            return {
            data:data.results,
            totalCount: data.totalRecords
            };
        }
        return {
            data:[],// response.data.data, // Server response data
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

    const columns = useMemo<ColumnDef<TWarehouse>[]>(
        () => [
        {
            accessorKey: 'id',
            accessorFn: (row) => row._id,
            header: () => <DataGridRowSelectAll />,
            cell: ({ row }) => <DataGridRowSelect row={row} />,
            enableSorting: false,
            enableHiding: false,
            meta: {
            headerClassName: 'w-0'
            }
        },
        {
            accessorFn: (row) => row.name,
            id: 'name',
            header: ({ column }) => (
            <DataGridColumnHeader
                title="Sucursal/Almacen"
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
                {info.row.original.name}/{info.row.original.type}
                </Link>
            </div>
            ),
            meta: {
            headerClassName: 'min-w-[280px]'
            }
        },
        {
            accessorFn: (row) => row.location,
            id: 'location',
            header: ({ column }) =><DataGridColumnHeader
            title="Dirección"
            filter={<ColumnFilter column={column} />}
            column={column}
            />,
            enableSorting: true,
            cell: (info) => (
            <span className="text-2sm text-gray-700 font-normal leading-3">
                {info.row.original.location}
            </span>
            ),
            meta: {
            className: 'min-w-[135px]'
            }
        },
        {
            accessorFn: (row) => row.active,
            id: 'active',
            enableSorting: true,
            enableHiding: false,
            header: ({ column }) => <DataGridColumnHeader title="Estatus" column={column} />,
            cell: (info) => (
                <span className="text-2sm text-gray-700 font-normal leading-3 flex items-center gap-1">
                {info.row.original.active ? (
                  <>
                    <CheckCircle className="text-green-600 w-4 h-4" />
                    Activo
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-600 w-4 h-4" />
                    Inactivo
                  </>
                )}
              </span>
            ),
            meta: {
            className: 'min-w-[135px]'
            }
        },
        {
            accessorFn: (row) => row.totalStock,
            id: 'totalStock',
            enableSorting: true,
            enableHiding: false,
            header: ({ column }) => <DataGridColumnHeader title="Stock Total" column={column} />,
            cell: (info) => (
                <span className="text-2sm text-gray-700 font-normal leading-3">
                    {info.row.original.totalStock}
                </span>
                ),
            meta: {
            className: 'min-w-[135px]'
            }
            
        },
        {
            accessorFn: (row) => row.lastStockUpdate,
            id: 'lastStockUpdate',
            enableSorting: true,
            enableHiding: false,
            header: ({ column }) => <DataGridColumnHeader title="Ultima Actualización" column={column} />,
            cell: (info) => formatIsoDate(info.row.original.lastStockUpdate),
            meta: {
            className: 'min-w-[135px]'
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
            <h3 className="card-title">Sucursales y Bodegas</h3>
            <div className="input input-sm max-w-48">
            <CustomIcon icon="magnifier" />
            <input
                type="text"
                placeholder="Buscar"
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            </div>
        </div>
        );
    };

    return (<Fragment>
    <DataGrid
        columns={columns}
        serverSide={true}
        onFetchData={fetchWharehouses}
        rowSelection={true}
        getRowId={(row: any) => row.id}
        onRowSelectionChange={handleRowSelection}
        pagination={{ size: 5 }}
        toolbar={<Toolbar setSearchQuery={setSearchQuery} />}
        layout={{ card: true }}
        />
    </Fragment> );
}
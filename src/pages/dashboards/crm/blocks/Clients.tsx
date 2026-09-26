import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
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
import { CommonRating } from '@/partials/common';
import { formatIsoDate } from '@/utils/Date';
import { Input } from '@/components/ui/input';
import { useAPIContext } from '@/auth/useAPIContext';
import { TProduct } from '../../product/blocks/products/teams-types';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

const Clients = () => {
  const {get,processResponseDirect} = useAPIContext();
  const [isOpenModal, setIsOpenModal] =  useState(false);

  const [isOpenModalProduct, setIsOpenModalProduct]=useState(false);
  const [isOpenModalCategory, setIsOpenModalCategory]=useState(false);
  const [isOpenModalBrand, setIsOpenModalBrand]=useState(false);
  const [isOpenModalUnit,setIsOpenModalUnit] =useState(false);

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

  const columns = useMemo<ColumnDef<TProduct>[]>(
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
        accessorFn: (row) => row.name,
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
              {info.row.original.name}/{info.row.original.category}
            </Link>
            <span className="text-2sm text-gray-700 font-normal leading-3">
              {info.row.original.description}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[280px]'
        }
      },
      {
        accessorFn: (row) => row.sku,
        id: 'rating',
        header: ({ column }) =><DataGridColumnHeader
          title="sku"
          filter={<ColumnFilter column={column} />}
          column={column}
        />,
        enableSorting: true,
        cell: (info) => (
          <span className="text-2sm text-gray-700 font-normal leading-3">
            {info.row.original.sku}
          </span>
        ),
        meta: {
          className: 'min-w-[135px]'
        }
      },
      {
        accessorFn: (row) => row.updated_at,
        id: 'updated_at',
        enableSorting: true,
        enableHiding: false,
        header: ({ column }) => <DataGridColumnHeader title="Ultima Actualización" column={column} />,
        cell: (info) => formatIsoDate(info.row.original.updated_at),
        meta: {
          className: 'min-w-[135px]'
        }
      },
      {
        accessorFn: (row) => row.stock,
        id: 'stock',
        enableSorting: true,
        enableHiding: false,
        header: ({ column }) => <DataGridColumnHeader title="Existencias" column={column} />,
        cell: (info) => (
          <span className="text-2sm text-gray-700 font-normal leading-3">
            {info.row.original.stock}
          </span>
        ),
        meta: {
          className: 'min-w-[135px]'
        }
      }
    ],
    []
  );

  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = async (params: TDataGridRequestParams) => {
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
      const response = await get('product',`${queryParams.toString()}`);
      const data =await processResponseDirect ({ response});
  
      if(data.data){
        return {
          data:data.data.results,
          totalCount: data.data.totalRecords
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
        <h3 className="card-title">Productos</h3>
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
        <button className="btn btn-sm btn-light btn-outline" onClick={()=>{setIsOpenModalProduct(true)}}>
          Nuevo Cliente
        </button>

      </div>
    );
  };

  return (
<Fragment>
<DataGrid
      columns={columns}
      serverSide={true}
      onFetchData={fetchProducts}
      rowSelection={true}
      getRowId={(row: any) => row.id}
      onRowSelectionChange={handleRowSelection}
      pagination={{ size: 5 }}
      toolbar={<Toolbar setSearchQuery={setSearchQuery} />}
      layout={{ card: true }}
    />
    {/* <AddProductModal open={isOpenModalProduct} onOpenChange={()=>setIsOpenModalProduct(false)} />
    <AddCategoryModal open={isOpenModalCategory} onOpenChange={()=>setIsOpenModalCategory(false)} />
    <AddBrandModal open={isOpenModalBrand} onOpenChange={()=>setIsOpenModalBrand(false)} />
    <AddUnitModal open={isOpenModalUnit} onOpenChange={()=>setIsOpenModalUnit(false)} /> */}
</Fragment>
  );
};

export { Clients };

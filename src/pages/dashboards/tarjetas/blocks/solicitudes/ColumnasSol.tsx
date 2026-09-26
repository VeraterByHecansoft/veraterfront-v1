


import { DataGridColumnHeader, DataGridRowSelect, DataGridRowSelectAll, useDataGrid, CustomIcon } from '@/components';
import { Input } from '@/components/ui/input';
import { Menu, MenuItem, MenuToggle, MenuLink, MenuTitle, MenuSub, MenuIcon } from '@/components';
import { Column, ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { IDataColicitud } from '@rute/types';
import { SolTarjetaInntecPDF } from '@/components/rute/SolTarjetaInntecPDF';

interface IColumnFilterProps<TData, TValue> {
    column: Column<TData, TValue>;
}
interface ColumnasSolProps {
    onView?: (data: any) => void,
    onBlock?: (data: any) => void,
    onFondeo?: (data: any) => void,
    onEcomerce?: (data: any) => void,
    onAsign?: (data: any) => void, // asignar
}
const ColumnasSol = ({ onView, onFondeo, onBlock, onEcomerce, onAsign }: ColumnasSolProps) => {
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
    return useMemo<ColumnDef<IDataColicitud>[]>(
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
                accessorFn: (row, index) => `${row.cod}`,
                id: 'cod',
                header: ({ column }) => <DataGridColumnHeader title="cod" column={column} />,
                enableSorting: true,
                cell: (info) => {
                    return (<div className="flex items-center gap-2.5">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-2sm text-gray-700 font-normal">
                                {info.row.original.cod}
                            </span>
                        </div>
                    </div>)
                },
                meta: {
                    headerClassName: 'w-0'
                }
            },
            {
                accessorFn: (row, index) => `${row.FolioInntec}`,
                id: 'FolioInntec',
                header: ({ column }) => <DataGridColumnHeader title="FolioInntec" column={column} />,
                enableSorting: true,
                cell: (info) => {
                    return (<div className="flex items-center gap-2.5">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-2sm text-gray-700 font-normal">
                                {info.row.original.FolioInntec}
                            </span>
                        </div>
                    </div>)
                },
                meta: {
                    headerClassName: 'w-0'
                }
            },


            {
                accessorFn: (row) => row.CLABEtj,
                id: 'CLABEtj',
                header: ({ column }) => <DataGridColumnHeader title="CLABEtj" column={column} />,
                enableSorting: true,
                cell: (info) => {
                    return (<div className="flex items-center gap-2.5">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-2sm text-gray-700 font-normal">
                                {info.row.original.CLABEtj}
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
                header: ({ column }) => <DataGridColumnHeader title="importe" filter={<ColumnInputFilter column={column} />} column={column} />,
                enableSorting: true,
                cell: (info) => {
                    const importe = info.row.original.importe
                    return (
                        <div className={`badge badge-sm badge-outline`}>
                            {importe}
                        </div>
                    );
                },
                meta: {
                    headerClassName: 'w-0'
                }
            },
            {
                accessorFn: (row) => row.iva,
                id: 'iva',
                header: ({ column }) => <DataGridColumnHeader title="iva" filter={<ColumnInputFilter column={column} />} column={column} />,
                enableSorting: true,
                cell: (info) => {
                    const iva = info.row.original.iva
                    return (
                        <div className={`badge badge-sm badge-outline`}>
                            {iva}
                        </div>
                    );
                },
                meta: {
                    headerClassName: 'w-0'
                }
            },
            {
                accessorFn: (row) => row.TOTAL,
                id: 'TOTAL',
                header: ({ column }) => <DataGridColumnHeader title="TOTAL" filter={<ColumnInputFilter column={column} />} column={column} />,
                enableSorting: true,
                cell: (info) => {
                    const TOTAL = info.row.original.TOTAL
                    return (
                        <div className={`badge badge-sm badge-outline`}>
                            {TOTAL}
                        </div>
                    );
                },
                meta: {
                    headerClassName: 'w-0'
                }
            },
            {
                accessorFn: (row) => row.idProd,
                id: 'idProd',
                header: ({ column }) => <DataGridColumnHeader title="idProd" column={column} />,
                enableSorting: true,
                cell: (info) => {
                    const idProd = info.row.original.idProd
                    return (
                        <div className={`badge badge-sm badge-outline`}>
                            {idProd}
                        </div>
                    );
                },
                meta: {
                    headerClassName: 'w-0'
                }
            },
            {
                accessorFn: (row) => row.idCliente,
                id: 'IsActiveEcommerce',
                header: ({ column }) => <DataGridColumnHeader title="idCliente" column={column} />,
                enableSorting: true,
                cell: (info) => {
                    const idCliente = info.row.original.idCliente
                    const color = 'badge-info';
                    return (
                        <div className={`badge badge-sm badge-outline ${color}`}>
                            {idCliente}
                        </div>
                    );
                },
                meta: {
                    headerClassName: 'w-0'
                }
            },
            {
                accessorFn: (row) => row.cantTjs,
                id: 'cantTjs',
                header: ({ column }) => <DataGridColumnHeader title="cantTjs" column={column} />,
                enableSorting: true,
                cell: (info) => {
                    const cantTjs = info.row.original.cantTjs
                    return (
                        <div className={`badge badge-sm badge-outline`}>
                            {cantTjs}
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
                    return (
                        <SolTarjetaInntecPDF data={info.row.original} />

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
export { ColumnasSol }
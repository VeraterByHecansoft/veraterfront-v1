/* eslint-disable prettier/prettier */
import { useEffect, useMemo, useState } from 'react';
import { Column, ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { DataGrid, DataGridColumnHeader, DataGridColumnVisibility, DataGridRowSelect, DataGridRowSelectAll, DefaultTooltip, CustomIcon, useDataGrid } from '@/components';
import { TSTPMovsData } from '.';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAPIContext } from '@/auth/useAPIContext';

const MESE = [
  { value: 0, label: 'Enero' },
  { value: 1, label: 'Febrero' },
  { value: 2, label: 'Marzo' },
  { value: 3, label: 'Abril' },
  { value: 4, label: 'Mayo' },
  { value: 5, label: 'Junio' },
  { value: 6, label: 'Julio' },
  { value: 7, label: 'Agosto' },
  { value: 8, label: 'Septiembre' },
  { value: 9, label: 'Octubre' },
  { value: 10, label: 'Noviembre' },
  { value: 11, label: 'Diciembre' },
]

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}
interface MovsoperatiosProps {
  CLABE: string,
}


const Movsoperatios = ({ CLABE}: MovsoperatiosProps) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const years = Array.from({ length: 8 }, (_, i) => 2026 - i);
  const { get } = useAPIContext()
  const [movs, setMovs] = useState<TSTPMovsData[]>([]);

  const loadMovs = () => {
    if (CLABE) {
      const url = `/movimientos/stp/${CLABE ? CLABE : ''}`
      const params = {
        pagina: 0,
        mm: currentMonth,
        yyyy: currentYear
      }
      get(url, params).then((data: any) => {
        const movs = data?.data as TSTPMovsData[]
        const M = movs.map((doc, index) => {
          console.log(doc)
          const f = { ...doc, id: `${index}` }
          return f
        })

      }).catch(err => { })
    }
  }

  // useEffect(() => {
  //   // loadMovs();
  // }, [currentYear, currentMonth]);

  const handleDonload = (data: TSTPMovsData) => {
    console.log('Descargando:', data);
    // Aquí puedes llamar a una API o generar un archivo
  };

  const handleView = (data: TSTPMovsData) => {
    console.log('Ver detalles:', data);
    // Abrir modal, navegar a detalle, etc.
  };

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

  const columns = useMemo<ColumnDef<TSTPMovsData>[]>(() => [
    {
      accessorKey: 'id',
      id: 'id',
      header: () => <DataGridRowSelectAll />,
      cell: ({ row }: any) => <DataGridRowSelect row={row} />,
      enableSorting: false,
      enableHiding: false,
      meta: {
        headerClassName: 'w-0'
      }
    },
    {
      id: 'iddoc',
      accessorFn: (row) => row.iddoc,
      header: ({ column }) => (
        <DataGridColumnHeader title="iddoc" column={column} />
      ),
      cell: (info) => (
        <span className={`badge badge-dot size-2 ${info.row.original.estatus}`}>
          {info.row.original.id}
        </span>
      ),
      meta: {
        headerClassName: 'w-[100px]',
        cellClassName: 'text-center'
      }
    },
    {
      id: 'estatus',
      accessorFn: (row) => row.estatus,
      header: ({ column }) => (
        <DataGridColumnHeader title="Status" column={column} />
      ),
      enableSorting: true,
      cell: (info: any) => (
        <span className={`badge badge-dot size-2 ${info.row.original.estatus}`}>
          {info.row.original.estatus || 'pendiente'}
        </span>
      ),
      meta: {
        headerClassName: 'w-[100px]',
        cellClassName: 'text-center'
      }
    },
    {
      id: 'tipo',
      accessorFn: (row) => row.tipo,
      header: ({ column }) => (
        <DataGridColumnHeader title="Tipo" column={column} />
      ),
      enableSorting: true,
      cell: (info: any) => (
        <span className={`badge badge-dot size-2 ${info.row.original.tipo === 'ingreso' ? 'bg-success' : 'bg-danger'}`}>
          {info.row.original.tipo}
        </span>
      ),
      meta: {
        headerClassName: 'w-[100px]',
        cellClassName: 'text-center'
      }
    },
    {
      id: 'cbeneficiario',
      accessorFn: (row) => row.cbeneficiario,
      header: ({ column }) => (
        <DataGridColumnHeader title="Beneficiario" filter={<ColumnInputFilter column={column} />} column={column} />
      ),
      enableSorting: true,
      cell: (info: any) => info.getValue(),
      meta: {
        headerTitle: 'Beneficiario',
        headerClassName: 'min-w-[170px]'
      }
    },
    {
      id: 'fecha',
      accessorFn: (row) => row.fecha,
      header: ({ column }) => (
        <DataGridColumnHeader title="Fecha" filter={<ColumnInputFilter column={column} />} column={column} />
      ),
      enableSorting: true,
      cell: (info: any) => info.getValue(),
      meta: {
        headerTitle: 'Fecha',
        headerClassName: 'w-[185px]'
      }
    },
    {
      id: 'concepto',
      accessorFn: (row) => row.concepto,
      header: ({ column }: any) => (
        <DataGridColumnHeader title="Concepto" column={column} />
      ),
      enableSorting: true,
      cell: (info: any) => info.getValue(),
      meta: {
        headerClassName: 'min-w-[185px]'
      }
    },
    {
      id: 'download',
      accessorFn: (row) => row.iddoc,
      header: () => '',
      enableSorting: false,
      cell: ({ row }: any) => (
        <button
          className="btn btn-sm btn-icon btn-clear btn-light"
          onClick={() => handleDonload(row.original)}
        >
          <CustomIcon icon="download" />
        </button>
      ),
      meta: {
        headerClassName: 'w-[60px]'
      }
    },
    {
      id: 'view',
      accessorFn: (row) => row.iddoc,
      header: () => '',
      enableSorting: false,
      cell: ({ row }: any) => (
        <button
          className="btn btn-sm btn-icon btn-clear btn-light"
          onClick={() => handleView(row.original)}
        >
          <CustomIcon icon="eye" />
        </button>
      ),
      meta: {
        headerClassName: 'w-[60px]'
      }
    }
  ], []);

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

  const handleClickFns = (event: string) => {
    alert(event)
  }

  const Toolbar = () => {
    const { table } = useDataGrid();
    return (
      <div className="card-header border-b-0 px-5 flex-wrap gap-2">
        <h3 className="card-title">Movimientos</h3>
        <div className="flex flex-wrap items-center gap-2">
          <Button className="btn btn-xs btn-info" >
            Buscar
          </Button>
          <Button className="btn btn-xs btn-link">Descargar</Button>
          {/* <DataGridColumnVisibility table={table} /> */}
        </div>
        <div className='flex flex-wrap items-center gap-2 w-1/4'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <CustomIcon icon='calendar' className="!size-[0.825rem] text-muted-foreground/90" />
                <span className="text-md">{currentMonth ? MESE[currentMonth].label : 'Seleciona el mes'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {MESE.map((item, inx) => {
                return (<DropdownMenuItem key={inx} onClick={() => { setCurrentMonth(item.value) }} selected={item.value == currentMonth}>
                  <CustomIcon icon='calendar' className="!size-[0.825rem] text-muted-foreground/90" />
                  <span className="grow">{item.label}</span>
                </DropdownMenuItem>)
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  };


  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-7.5">
      <div className="col-span-3">
        <div className="flex flex-col gap-5 lg:gap-7.5">
          <div className="flex gap-5 lg:gap-7.5">
            <div
              className={`card grow `}
            >
              <DataGrid
                columns={columns}
                data={movs || []}
                getRowId={(row: any) => row.id}
                rowSelection={true}
                onRowSelectionChange={handleRowSelection}
                pagination={{ size: 10 }}
                sorting={[{ id: 'cbeneficiario', desc: false }]}
                toolbar={<Toolbar />}
                layout={{ card: true }}
                messages={{
                  loading: 'Cargando movimientos...',
                  empty: 'No se encontraron movimientos.'
                }}
              />
            </div>
            <div className="flex flex-col gap-2.5" >
              {years.map((year, index) => (
                <span
                  key={index}
                  className={`btn btn-sm text-gray-600 hover:text-primary tab-active:bg-primary-light tab-active:text-primary ${year === currentYear ? 'active' : ''
                    }`}
                  onClick={() => {
                    setCurrentYear(year);
                  }}
                >
                  {year}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export { Movsoperatios };

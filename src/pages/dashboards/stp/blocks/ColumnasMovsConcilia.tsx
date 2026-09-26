/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import {
  DataGridColumnHeader,
  DataGridRowSelect,
  DataGridRowSelectAll,
  CustomIcon
} from '@/components';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Menu, MenuItem, MenuLink, MenuTitle, MenuIcon } from '@/components';
import { Column, ColumnDef } from '@tanstack/react-table';
import { IDataConciliaSTP } from '@rute/types';
import { useMemo } from 'react';
import { formatearMonedaMXN } from '@/utils/Money';
import { formatTimestamp } from '@/utils/Date';
type statusT = "Cancelada" | "Liquidado" | "Devuelta"

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}
interface ColumnasProps {
  onView?: (data: any) => void;
  onCancel?: (data: any) => void;
  onDownload?: (data: any) => void;
  onAutorize?: (data: any) => void;
  onUpdate?: (data: any) => void;
}
const ColumnasMovsConcilia = ({
  onView,
  onCancel,
  onUpdate,
  onDownload,
  onAutorize
}: ColumnasProps) => {
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
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Clave de rastreo"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => {
          const color = info.row.original.isFound
            ? 'badge-success text-success'
            : 'badge-warning text-warning';
          const urlCEP = info.row.original.urlCEP;
          const paresST = {
            "Liquidado": "LQ",
            "Cancelada": "CDA",
            "Devuelta":"CDA"
          }

          const rtstatus = info.row.original?.rtstatus;
          const color2 = rtstatus == 'R' ? 'badge-success text-success' : 'badge-warning text-warning';
          const label = rtstatus == 'LQ' ? 'Ingreso' : rtstatus
          const stps = info.row.original?.estado as statusT
          const updat = paresST[stps]
          return (
            <div className='flex flex-col gap-1'>
              <div className={`badge badge-sm badge-outline ${color}`}>
                <a href={urlCEP} target="_blank">
                  {info.row.original.claveRastreo}
                </a>
              </div><br/>
              {info.row.original.isFound &&
               <div className={`badge badge-sm badge-outline`}>
                   <b>{info.row.original.iddoc}</b>
              </div>}
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
                  <MenuItem
                    onClick={() => {
                      if(info?.row?.original?.rtstatus == 'NF'){
                        onAutorize?.(info.row.original);
                      }else if (info?.row?.original?.rtstatus !== updat ) {
                        onUpdate?.(info.row.original);
                      }else {
                        toast.info('Nada por hacer')
                      }
                    }}
                  >
                    {
                      info.row.original.isFound ? (
                        info?.row?.original?.rtstatus !== updat  && <MenuLink>
                          <MenuTitle className="text-left text-gray-900 font-medium">
                            <span className={`badge badge-sm badge-light badge-outline ${color2}`}>Actualizar</span>
                          </MenuTitle>
                        </MenuLink>
  
                      )
                        : (
                          <MenuLink>
                            <MenuTitle className="text-left text-gray-900 font-medium">
                              <span className={`badge badge-sm badge-light badge-outline ${color2}`}>Registrar</span>
                            </MenuTitle>
                          </MenuLink>
                        )
                    }
                  </MenuItem>
                </MenuItem>
              </Menu>
            </div>
          );
        },
        meta: {
          headerClassName: 'w-[auto]'
        }
      },
      {
        accessorFn: (row) => row.tsCaptura,
        id: 'tsCaptura',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="fecha de captura"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => {
          const startus = info?.row?.original.rtstatus;
          return formatTimestamp(info.row.original.tsCaptura);
        },
        meta: {
          headerClassName: 'min-w-[auto]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.rtstatus,
        id: 'rtstatus',
        header: ({ column }) => <DataGridColumnHeader
          filter={<ColumnInputFilter column={column} />}
          title="rtstatus" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const rtstatus = info.row.original.rtstatus;
          const color =
            rtstatus == 'LQ' ? 'badge-success text-success' : 'badge-warning text-warning';
          return (
            <span className={`badge badge-sm badge-light badge-outline ${color}`}>{rtstatus}</span>
          );
        },
        meta: {
          headerClassName: 'min-w-[auto]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.tipoOrden,
        id: 'tipoOrden',
        header: ({ column }) => <DataGridColumnHeader
          filter={<ColumnInputFilter column={column} />}
          title="tipoOrden" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const estado = info.row.original.tipoOrden;
          const color = estado == 'R' ? 'badge-success text-success' : 'badge-warning text-warning';
          const label = estado == 'R' ? 'Ingreso' : estado == 'E' ? 'Egreso' : info.row.original.tipoOrden
          return (
            <span className={`badge badge-sm badge-light badge-outline ${color}`}>{label}</span>
          );
        },
        meta: {
          headerClassName: 'min-w-[auto]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.fechaOperacion,
        id: 'fechaOperacion',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="fechaOperacion"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => {
          return info.row.original.fechaOperacion;
        },
        meta: {
          headerClassName: 'w-[auto]'
        }
      },
      {
        accessorFn: (row) => row.tsLiquidacion,
        id: 'tsLiquidacion',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="fecha de liquidacion"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => {
          return formatTimestamp(info.row.original.tsLiquidacion);
        },
        meta: {
          headerClassName: 'min-w-[auto]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.claveRastreoDev,
        id: 'claveRastreoDev',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="claveRastreoDev"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => {
          return `${info.row.original.claveRastreoDev}`;
        },
        meta: {
          headerClassName: 'min-w-[auto]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.conceptoPago,
        id: 'conceptoPago',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="conceptoPago"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => {
          return <span>
            {info.row.original.conceptoPago}<br />
            monto: {formatearMonedaMXN(info.row.original.monto)}</span>;
        },
        meta: {
          headerClassName: 'min-w-[auto]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.cuentaBeneficiario,
        id: 'cuentaBeneficiario',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Beneficiario"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => {
          return <span>
            {info.row.original.cuentaBeneficiario}<br />
            {info.row.original.nombreBeneficiario}</span>;
        },
        meta: {
          headerClassName: 'min-w-[auto]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.cuentaOrdenante,
        id: 'cuentaOrdenante',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Ordenante"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => {
          return <span>
            {info.row.original.cuentaOrdenante}<br />
            {info.row.original.nombreOrdenante}</span>;
        },
        meta: {
          headerClassName: 'min-w-[auto]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.empresa,
        id: 'empresa',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="empresa"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => {
          return info.row.original.empresa;
        },
        meta: {
          headerClassName: 'min-w-[auto]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.estado,
        id: 'estado',
        header: ({ column }) => <DataGridColumnHeader
          filter={<ColumnInputFilter column={column} />}
          title="estado" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const estado = info.row.original.estado;
          const color =
            estado == 'Liquidado' ? 'badge-success text-success' : estado == 'Autorizada' ? 'badge-info text-info' : 'badge-warning text-warning';
          return (
            <span className={`badge badge-sm badge-light badge-outline ${color}`}>{estado}</span>
          );
        },
        meta: {
          headerClassName: 'min-w-[auto]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.fechaNatural,
        id: 'fechaNatural',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Fecha natural"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => {
          return info.row.original.fechaNatural;
        },
        meta: {
          headerClassName: 'w-[auto]'
        }
      },
      {
        accessorFn: (row) => row.institucionContraparte,
        id: 'institucionContraparte',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="institucionContraparte"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => {
          return info.row.original.institucionContraparte;
        },
        meta: {
          headerClassName: 'min-w-[auto]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.institucionOperante,
        id: 'institucionOperante',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="institucionOperante"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => {
          return info.row.original.institucionOperante;
        },
        meta: {
          headerClassName: 'min-w-[auto]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.monto,
        id: 'monto',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="monto"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => {
          return formatearMonedaMXN(info.row.original.monto);
        },
        meta: {
          headerClassName: 'min-w-[auto]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },

      {
        accessorFn: (row) => row.nombreCep,
        id: 'nombreCep',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="nombreCep"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => {
          return info.row.original.nombreCep;
        },
        meta: {
          headerClassName: 'min-w-[auto]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.rfcCep,
        id: 'rfcCep',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="rfcCep"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => {
          return info.row.original.rfcCep;
        },
        meta: {
          headerClassName: 'min-w-[auto]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.referenciaNumerica,
        id: 'referenciaNumerica',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="referenciaNumerica"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => {
          return info.row.original.referenciaNumerica;
        },
        meta: {
          headerClassName: 'min-w-[auto]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.rfcCurpBeneficiario,
        id: 'rfcCurpBeneficiario',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="rfcCurpBeneficiario"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => {
          return info.row.original.rfcCurpBeneficiario;
        },
        meta: {
          headerClassName: 'min-w-[auto]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.rfcCurpOrdenante,
        id: 'rfcCurpOrdenante',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="rfcCurpOrdenante"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => {
          return info.row.original.rfcCurpOrdenante;
        },
        meta: {
          headerClassName: 'min-w-[auto]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.tipoCuentaBeneficiario,
        id: 'tipoCuentaBeneficiario',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="tipoCuentaBeneficiario"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => {
          return info.row.original.tipoCuentaBeneficiario;
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.tipoCuentaOrdenante,
        id: 'tipoCuentaOrdenante',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="tipoCuentaOrdenante"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => {
          return info.row.original.tipoCuentaOrdenante;
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.tipoPago,
        id: 'tipoPago',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="tipoPago"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => {
          return info.row.original.tipoPago;
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      }
    ],
    []
  );
};
export { ColumnasMovsConcilia };

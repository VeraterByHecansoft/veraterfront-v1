import React from 'react';
import ExcelJS from 'exceljs';

interface SafeExcelExporterProps {
  data: Array<any>,
  filename: string
}


type HEADEWRS =  "TIMESTAMP" |
    "ORDENANTE" | "BENEFICIARIO" | "IMPORTE"  | "CONCILIADO" | "DIAOPERATIVO" |
    "ESTADO" |
    "CONCEPTO"|
    "CLAVEDERASTREO"|
    "tsCaptura"|
    "tsLiquidacion"|
    "urlCEP"

export const SafeExcelExporter = ({ data, filename }: SafeExcelExporterProps) => {

  // Función para convertir timestamp a fecha México
  const timestampToMexicoDate = (timestamp: any) => {
    if (!timestamp) return '';

    const date = new Date(parseInt(timestamp));

    // Opción 1: Usar toLocaleString para zona horaria México
    return date.toLocaleString('es-MX', {
      timeZone: 'America/Mexico_City',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };


  // Transformar los datos antes de exportar
  const transformData = (originalData: Array<any>) => {
    return originalData.map(item => ({
      TIMESTAMP: timestampToMexicoDate(item.tsCaptura),
      ORDENANTE: item.cuentaOrdenante,
      TIPO:item.tipoOrden == 'R'?'INGRESO':'EGRESO',
      BENEFICIARIO: item.cuentaBeneficiario,
      IMPORTE: item.tipoOrden == 'R'? parseFloat(item.monto):-parseFloat(item.monto),
      CONCILIADO: item.isFound ? 'SI' : 'NO',
      DIAOPERATIVO: item.fechaNatural,
      ESTADO: item.estado,
      CONCEPTO: item.conceptoPago,
      CLAVEDERASTREO: item.claveRastreo,
      tsCaptura: timestampToMexicoDate(item.tsCaptura),
      tsLiquidacion: timestampToMexicoDate(item.tsLiquidacion),
      urlCEP: item.urlCEP ///éste debe ser el link/boton  contiene una url
    }));
  };
  const exportToExcel = async () => {
  try {
    const transformedData = transformData(data);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos');

    if (transformedData.length > 0) {
      const headers = Object.keys(transformedData[0]);

      // Configurar columnas
      worksheet.columns = headers.map(header => ({
        header: header.toUpperCase(),
        key: header,
        width: getColumnWidth(header)
      }));

      // Agregar encabezados
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2F75B5' }
      };

      // Agregar datos
      transformedData.forEach((item, index) => {
        const row = worksheet.addRow({});
        
        headers.forEach((header, colIndex) => {
          const cell = row.getCell(colIndex + 1);
          
          if (header === 'urlCEP' && item[header]) {
            // Botón para urlCEP
            createButtonCell(cell, item[header]);
          } else {
            // Valor normal
            const keyItem =header as HEADEWRS
            cell.value = item[keyItem];
            
            // Formato para fechas y números
            if (header === 'IMPORTE') {
              cell.numFmt = '$#,##0.00';
            }
          }
        });
      });

      // Función auxiliar para ancho de columnas
      function getColumnWidth(header: string): number {
        const widths: { [key: string]: number } = {
          'urlCEP': 12,
          'tsCaptura': 20,
          'tsLiquidacion': 20,
          'CONCEPTO': 25,
          'CLAVEDERASTREO': 18,
          'IMPORTE': 15
        };
        return widths[header] || 15;
      }

      // Función auxiliar para crear celdas de botón
      function createButtonCell(cell: any, url: string) {
        cell.value = {
          text: '🔗 Ver CEP',
          hyperlink: url
        };
        cell.font = {
          color: { argb: 'FFFFFFFF' },
          bold: true
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF2196F3' } // Azul
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      }
    }

    // Resto del código para generar y descargar el archivo...
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error exporting Excel:', error);
  }
};
/*
  const exportToExcel = async () => {
    try {
      // Transformar datos
      const transformedData = transformData(data);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Datos');

      if (transformedData.length > 0) {
        const headers = Object.keys(transformedData[0]);

        // Encabezados
        worksheet.addRow(headers);
        worksheet.getRow(1).font = { bold: true };

        // Datos
        transformedData.forEach(item => {
          worksheet.addRow(headers.map(header => item[header]));
        });

        // Ajustar columnas
        worksheet.columns = headers.map(header => ({
          header,
          key: header,
          width: header.includes('ts') ? 20 : 15
        }));
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error exporting Excel:', error);
    }
  };
*/
  return (
    <button onClick={exportToExcel} className="inline-flex items-center justify-center whitespace-nowrap font-medium ring-0 focus:ring-0 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 btn btn-light text-xs btn-sm h-8 rounded-md px-3 gap-1">
      Exportar
    </button>
  );
};
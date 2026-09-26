
export type Months = 'Oct'|'Nov'| 'Dec'| 'Jan'| 'Feb'| 'Mar'| 'Apr'| 'May'| 'Jun';

export interface DataForPeriodBalanceModel {
  categories: Array<Months>;
  dataType:Array<Number>
  balance?:DataBalanceModel
}

export interface DataBalanceModel {
  ingresos: Number;
  egresos: Number;
  porCobrar: Number;
  ventas: Number;
  dataType:Number
}
export interface DataResponse {
  status:Number ;
  message: string;
  error?: string|null ;
  data: any;
}
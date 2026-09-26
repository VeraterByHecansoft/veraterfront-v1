/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */

declare module '@rute/types' {

  export type operationStatus = 'idle' | 'succeeded' | 'pending' | 'failed' | 'active';
  export interface operationResult {
    event?: string;
    status?: operationStatus;
    error: boolean;
    message: string;
    metadata: any;
  }

  export interface TokenResponse {
    code: string;
    timeStamp: number;
    expire: number;
    uuid: string;
  }

  export type TMovType = "INGR" | "EGRE" | "TRAS" | "TERM" | "SLIB" | "Dispersion" | "Pago" | "WITHDRAWAL" | "PURCHASE"
  export type TMovStatus = "CDO" | "LQ" | "CDA" | "PDT" | "DECLINED" | "CLEARED" | "Aplicado" | "KNOWN"
  export type TGMoveType = "CLABE" | "INNTEC" | "POS" | "CREDITO" | "DEFAULT"
  export type TIconRecept = "card" | "wallet" | "add" | "call-outline" | "call" | "alert"
  export type TTypeRecept = "TARJETA" | "CLABE" | "NUEVO" | "TELEFONO" | "FONDEO" | "KNOWN"

  export interface TBanco {
    clave: string;
    nombre: string;
    descripcion: string;
  }

  export interface TCEP {
    urlCEP?: string;
    origin_name?: string,
    deposit_account_name?: string,
    referenciaNumerica?: number,
    fechaOperacion?: number
  }

  export interface IDataColicitud {
    id: string;
    cod: string;
    CLABEtj: string;
    importe: string;
    iva: string;
    TOTAL: string;
    idProd: string;
    idCliente: string;
    cantTjs: string;
    FolioInntec?:string
  }

  /**
   * Interface que representa el Perfil
   */
  export interface TDataPerfil {
    /** Identificador único del usuario */
    id: string;

    /** Dominio asociado al usuario */
    dom: string;

    /** Nombre de usuario (login) */
    USR: string;

    /** Nombre */
    NOMBRE: string;

    /** Apellido paterno */
    APP: string;

    /** Apellido materno */
    APM: string;

    /** Nombres (puede ser igual a NOMBRE) */
    nombres: string;

    /** Número de celular */
    cel: string;

    /** Correo electrónico */
    email: string;

    /** UUID de la imagen de perfil */
    imgperf: string;

    /** Tipo de usuario (ej: admin, member, client) */
    tipo: string;

    /** Favoritos del usuario (opcional) */
    fav?: string;

    /** Empresas asociadas al usuario (opcional)*/
    Empresas?: string;

    /** Aplicaciones vinculadas (opcional) */
    Apps?: string;

    /** Género (M/F) */
    sexo: string;

    /** ID del perfil (opcional) */
    idpeefil?: string;

    /** Perfiles de acceso (opcional) */
    perfiles?: string;

    /** Información de cuenta */
    cuenta: string;

    /** Estado de la cuenta (activo/inactivo) */
    estatus: string;

    /** Calificación del usuario */
    raiting: string;

    /** CLABE bancaria */
    CLABE: string;

    /** Código CBECIRCON */
    CBEcircon: string;

    /** ID CIRCON */
    idcircon: string;

    /** UUID de la imagen de banner */
    imgbanner: string;

    // Campos adicionales para validación de seguridad
    /** Firma digital para validación (opcional) */
    firma?: string;

    /** Auditoría - Fecha de creación (opcional) */
    a?: Date;

    /** Id del token (si lo tiene) */
    idt?: string | boolean | undefined;
  }

  /**
   * Interface que representa un Movimiento
   */
  export interface IDataMovStp {
    type: 'CLABE';          // Tipo fijo
    fechCrea: string;
    id: string;             // ID único del documento
    iddoc: string;          // ID del documento (duplicado)
    folio: number;
    tipo: TMovType;           // Tipo de operación (INGR/EGRE/SLIB)
    estatus: TMovStatus;        // Estado de la operación
    fecha: string;          // Fecha en formato YYYY-MM-DD
    time: string;           // Hora en formato HH:MM:SS
    importe: number;        // Monto de la operación
    saldo: number;
    tipotrans: number;
    impuestos: number;
    concepto: string;       // Descripción
    cbeneficiario: string;  // Beneficiario
    referencia: string;     // Referencia
    CVERast: string;        // Clave de rastreo
    esSTP?: string;
    tsLiquidacion?: string;
    tsDevolucion?: string;
    clabeordenante?: string;
    urlCEP?: string;
  }


  export interface IDataConciliaSTP {
    idEF: string;
    claveRastreo: string;
    claveRastreoDev?: string;
    conceptoPago: string;
    cuentaBeneficiario: string;
    cuentaOrdenante: string;
    empresa: string;
    estado: string;
    tipoOrden: "R" | "E";
    fechaOperacion: number;
    fechaNatural: number;
    institucionContraparte: number;
    institucionOperante: number;
    medioEntrega: number;
    monto: number;
    nombreBeneficiario: string;
    nombreOrdenante: string;
    nombreCep: string;
    rfcCep: string;
    sello?: string;
    referenciaNumerica: number;
    rfcCurpBeneficiario: string;
    rfcCurpOrdenante: string;
    tipoCuentaBeneficiario: number;
    tipoCuentaOrdenante: number;
    tipoPago: number;
    tsCaptura: number;
    tsLiquidacion: number;
    causaDevolucion?: string;
    urlCEP: string;
    isFound: boolean;
    iddoc?: string,
    rtstatus?: string
  }


  /**
   * Interfaz que representa una tarjetas
   */
  export interface IDataTarjeta {
    /** Identificador único de la tarjeta en la base de datos */
    _id: string;

    /** Número de tarjeta (16 dígitos típicamente) */
    NoT: string;

    /** CLABE asociada a la tarjeta (18 caracteres) */
    CLABE: string;

    /** Número de Identificación Personal (PIN) */
    NIP: string;

    /** Identificador único del cliente en el sistema de tarjetas */
    ClienteId: string;

    /** Identificador del producto de tarjeta */
    ProductoId: string;

    /** Clave única del empleado asociado */
    ClaveEmpleado: string;

    /** Fecha de vencimiento de la tarjeta (formato MM/YY) */
    fvenc: string;

    /** Nombre completo del titular */
    Nombre: string;

    /** Apellido paterno del titular */
    Paterno: string;

    /** Apellido materno del titular */
    Materno: string;

    /** Registro Federal de Contribuyentes */
    Rfc: string;

    /** Clave Única de Registro de Población */
    Curp: string;

    /** Número de Seguridad Social */
    Nss: string;

    /** Código de seguridad (CVV) */
    cvv: string;

    /** Límite para comercio electrónico */
    ecomerce: string;

    /** Estado actual de la tarjeta (ej: 'A' = Activa, 'I' = Inactiva) definir los estatus */
    estado: string; //'A' | 'I' | 'B' | 'S'; // A: Activa, I: Inactiva, B: Bloqueada, S: Suspendida

    /** Grupo de asociación CLABE|ClienteID */
    gpo: string;

    /** Comentarios adicionales */
    comentarios: string;

    /** Indicador de archivado (vacío = no archivado) */
    archivado: '' | 'archivado';
  }

  export interface IDataIntecTC {
    id: string
    ClienteID2: string;
    TarjetaID: number;
    NoTarjeta: string;
    ClaveEmpleado: string;
    NombreTH: string;
    ProductoNombre: string;
    IsActiveEcommerce: boolean;
    EstatusId: number;
    Estatus: string;
    ContactoId: mumber;
  }

  export interface IDataIntecTCMov {
    "type": string;
    "id": string;
    "tipo": string;
    "estatus": string;
    "fecha": string;
    "time": string;
    "importe": mumber;
    "concepto": string;
    "referencia": string;
    "trxId": mumber;
    "montoMonendaLocal": mumber;
    "comercio": string;
    "codigoAutorizacion": string;
    "trxType": string;
    "trxStatus": string;
    "merchantId": string;
  }

  export interface TTransferRecept {
    BANCO: string;
    value: string;
    CLABE: string;
    label: string;
    type: TTypeRecept;
    icon: TIconRecept;
    nombre: string;
    vspart: string;
  }

  export interface TPreTrasfer {
    TIPO: string;
    BANCO: string;
    CLABE: string;
    nombreReceptor: string;
    nombreEmisor: string;
    concepto: string;
    importe: string;
    referencia: string;
    clabeOrigen?: string
  }

  export type TCEP = {
    deposit_account_name: string;
    fechaOperacion: string;
    origin_name: string;
    referenciaNumerica: string;
    urlCEP: string;
    cadqr?: string
  }

  export type MovGeneral = {
    type: TGMoveType;
    id: string;
    tipo: TMovType;
    estatus: TMovStatus;
    fecha: string;
    time: string;
    importe: number;
    concepto: string;
    referencia?: string;
  }

  export type MovCLABE = {
    cbeneficiario?: string;
    CVERast?: string;
  }

  export type MovPOS = {
    IDestatusTrans?: string;
    montoTotal?: string;
    comision?: string;
  }

  export type MovINNTEC = {
    trxId?: string;
    montoMonendaLocal?: string;
    comercio?: string;
    codigoAutorizacion?: string;
    trxType?: string;
    trxStatus?: string;
    merchantId?: string;
  }

  export type TMovTransaction = MovGeneral & MovCLABE & MovPOS & MovINNTEC & {
    /** Operación */
    claveRastreo?: string;
    fechaOperacion?: string;
    fehaApic?: string;
    clabeordenante?: string;
    nombreOrdenante?: string;
    cuentaOrdenante?: string;
    institucionOperante?: string;
    tipoCuentaOrdenante?: string;
    nombreBeneficiario?: string;
    cuentaBeneficiario?: string;
    institucionContraparte?: string;
    tipoCuentaBeneficiario?: string;
    tsLiquidacion?: string;
    referenciaNumerica?: string;
    claveRastreoDevolucion?: string;
    cep?: TCEP,
  }

  export type TBancoItem = {
    value: string;
    text: string;
    clave: string;
    nombre: string;
    vspart: string;
    descripcion: string;
  }

  export interface ISTPMVC {
    id: string,
    idEF: number,
    claveRastreo?: string,
    claveRastreoDev?: string,
    conceptoPago: string,
    cuentaBeneficiario: string,
    cuentaOrdenante: string,
    empresa: string,
    estado: string,
    tipoOrden: string,
    fechaOperacion: number,
    fechaNatural: number,
    institucionContraparte: number,
    institucionOperante: number,
    medioEntrega: number,
    monto: number,
    nombreBeneficiario: string,
    nombreOrdenante: string,
    nombreCep: string,
    rfcCep: string,
    sello: string,
    rfcCurpBeneficiario: string,
    referenciaNumerica: number,
    rfcCurpOrdenante: string,
    tipoCuentaBeneficiario: number,
    tipoCuentaOrdenante: number,
    tipoPago: number,
    tsCaptura: number,
    tsLiquidacion: number,
    causaDevolucion?: string,
    urlCEP: string,
    isFound?: boolean
  }
}
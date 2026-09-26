interface TDataModelPERFIL {
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
}

export { type TDataModelPERFIL };

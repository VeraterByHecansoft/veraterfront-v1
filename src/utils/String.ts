export const camelToSnakeCase = (str: string) => {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
};

export const snakeToCamelCase = (str: string) => {
  return str.replace(/(_\w)/g, (match) => match[1].toUpperCase());
};


export const sanitizeText = (input: string): string =>{
  return input
    .normalize('NFD')                          // Elimina tildes y acentos
    .replace(/[\u0300-\u036f]/g, '')            // Elimina diacríticos (acentos)
    .replace(/[^a-zA-Z0-9\s]/g, '')             // Elimina caracteres no alfanuméricos excepto espacios
    .trim()                                     // Quita espacios al inicio y al final
    .replace(/\s+/g, '-')                       // Reemplaza uno o más espacios por un solo guión
    .toLowerCase();                             // Opcional: pasar todo a minúsculas
}
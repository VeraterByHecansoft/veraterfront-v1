
export const monthNames = [
  'Enero',
  'Febero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Jullio',
  'Augosto',
  'Septiembre',
  'Octtubre',
  'Novviembre',
  'Deciembre'
];
export const formatIsoDate = (isoDate: string) => {
  const date = new Date(isoDate);

  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

export const MESE = [
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


export const formatTimestamp = (timestamp: string | number): string => {
  let date: Date;

  // Normalizar el timestamp
  if (typeof timestamp === "string") {
    // Si viene como string numérico ("1692537600000")
    const asNumber = Number(timestamp);
    date = isNaN(asNumber) ? new Date(timestamp) : new Date(asNumber);
  } else {
    // Si ya es número
    date = new Date(timestamp);
  }

  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
};

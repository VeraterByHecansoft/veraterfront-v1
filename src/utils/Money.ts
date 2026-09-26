function formatearMonedaMXN(valor: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true, // <-- asegura separación de miles
  }).format(valor);
}

export { formatearMonedaMXN };
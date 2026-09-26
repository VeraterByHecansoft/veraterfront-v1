
export function formatCurrency(value:string, decimals = 2, locale = 'es-MX', currency = 'MXN') {
    const number = parseFloat(value);
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(number);
}
export function formatMoneyRounded(value:string, decimals = 2) {
    const number = parseFloat(value);
    return number.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
}
export function formatMoneyExact(value:string, decimals = 4) {
    const parts = Number(value).toFixed(decimals).split('.');
    const integerPart = parseInt(parts[0]).toLocaleString('en-US');
    return `${integerPart}.${parts[1]}`;
}

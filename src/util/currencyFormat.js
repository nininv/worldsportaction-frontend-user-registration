import currencyFormatter from 'currency-formatter';

///////function for returning currency format text number
export function currencyFormat(data) {
    return currencyFormatter.format(data, { code: 'USD' });
}

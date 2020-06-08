const { calculateDecimals, calculateLimit } = require('./utils.controller');

describe('utils controller', () => {
    it('checks calculateDecimals returns decimals properly, no decimals', () => {
        const result = calculateDecimals(1000);

        expect(result).toBe(0);
    });

    it('checks calculateDecimals returns decimals properly, one decimal', () => {
        const result = calculateDecimals(7.2);

        expect(result).toBe(20);
    });

    it('checks calculateDecimals returns decimals properly, two decimals', () => {
        const result = calculateDecimals(100.44);

        expect(result).toBe(44);
    });

    it('checks calculateDecimals returns decimals properly, string', () => {
        const result = calculateDecimals('1000');

        expect(result).toBe(0);
    });

    it('checks calculateDecimals returns decimals properly, any string', () => {
        const result = calculateDecimals('hola');

        expect(result).toBe(0);
    });

    it('checks calculateDecimals returns decimals properly, nothing', () => {
        const result = calculateDecimals();

        expect(result).toBe(0);
    });

    it('checks calculateLimit returns limit param properly, specific number, less than 20', () => {
        const result = calculateLimit(10);

        expect(result).toBe('&limit=10');
    });

    it('checks calculateLimit returns max limit param properly, specific naumber, more than 20', () => {
        const result = calculateLimit(550);

        expect(result).toBe('&limit=20');
    });

    it('checks calculateLimit returns limit param properly, nothing', () => {
        const result = calculateLimit();

        expect(result).toBe('&limit=20');
    });
});

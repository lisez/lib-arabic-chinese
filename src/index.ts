import Digit, { TConfig } from './Digit';

export type TConverterConfig = Pick<TConfig, Exclude<keyof TConfig, 'placeUnit'>>;

export default function main(
  text: number | string,
  config: Partial<TConverterConfig> = {}
): string {
  if (typeof text === 'number') {
    return main(text.toString(), config);
  }

  const toNormal = text.normalize('NFKC');

  if (!/^[\d,，]+/.test(toNormal)) {
    return text;
  }

  const digits: Digit[] = [];
  toNormal
    .replace(/[,，]/g, '')
    .split('')
    .reverse()
    .forEach((n, i) => {
      const digit = new Digit(n, { ...config, placeUnit: i });
      if (digits.length > 0) {
        digit.setPrev(digits[i - 1]);
        digits[i - 1].setNext(digit);
      }
      digits.push(digit);
    });

  return digits.reduce((p, c) => c.toString() + p, '');
}

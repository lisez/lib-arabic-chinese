import Digit, { TConfig } from './Digit';

export interface IConverterConfig extends Pick<TConfig, Exclude<keyof TConfig, 'placeUnit'>> {
  readonly prefix: string;
  readonly suffix: string;
}

function numberTextToDigits(numbers: string[], config: Partial<IConverterConfig> = {}): Digit[] {
  const digits: Digit[] = [];
  numbers.forEach((n, i) => {
    const digit = new Digit(n, { ...config, placeUnit: i });
    if (digits.length > 0) {
      digit.setPrev(digits[i - 1]);
      digits[i - 1].setNext(digit);
    }
    digits.push(digit);
  });
  return digits;
}

export default function main(
  text: number | string,
  config: Partial<IConverterConfig> = {}
): string {
  if (typeof text === 'number') {
    return main(text.toString(), config);
  }

  const toNormal = text.normalize('NFKC');

  if (!/^[\d,，]+/.test(toNormal)) {
    return text;
  }

  const digits = numberTextToDigits(
    toNormal
      .replace(/[,，]/g, '')
      .split('')
      .reverse(),
    config
  );

  const number = digits.reduce((p, c) => c.toString() + p, '');

  const prefix = (config.prefix !== void 0 && config.prefix) || '';
  const suffix = (config.suffix !== void 0 && config.suffix) || '';

  return prefix + number + suffix;
}

import Signed, { TSignedConfig } from './Signed';
import Digit, { TConfig, defaultConfig } from './Digit';

export interface IConverterConfig
  extends Pick<TConfig, Exclude<keyof TConfig, 'placeUnit'>>,
    TSignedConfig {
  readonly prefix: string;
  readonly suffix: string;
}

const defaultConverterConfig: IConverterConfig = {
  ...defaultConfig,
  prefix: '',
  suffix: '',
  showPlusSigned: false,
  showMinusSigned: true
};

function objectize(numbers: string[], config: Partial<IConverterConfig> = {}): Digit[] {
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

function isValidNumberText(nText: string): boolean {
  return /^[+-]?(?:\d[\d,，]+\d|\d+)/.test(nText);
}

export default function main(
  text: number | string,
  userConfig: Partial<IConverterConfig> = defaultConverterConfig
): string {
  if (typeof text === 'number') {
    return main(text.toString(), userConfig);
  }

  const toNormal = text.normalize('NFKC');
  const config = { ...defaultConverterConfig, ...(userConfig || {}) };

  if (!isValidNumberText(toNormal)) {
    return text;
  }

  const hasSigned = Signed.hasSigned(toNormal);

  let signed: string = '';
  if (hasSigned) {
    signed = new Signed(toNormal.charAt(0), config).toString();
  }

  const numberText = hasSigned ? toNormal.slice(1) : toNormal;
  const numberToChars = numberText
    .replace(/[,，]/g, '')
    .split('')
    .reverse();

  const numberToDigits = objectize(numberToChars, config);
  const number = numberToDigits.reduce((p, c) => c.toString() + p, '');

  const prefix = (config.prefix !== void 0 && config.prefix) || '';
  const suffix = (config.suffix !== void 0 && config.suffix) || '';

  return prefix + signed + number + suffix;
}

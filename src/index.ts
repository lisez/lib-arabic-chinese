import Signed, { TSignedConfig, defaultSignedConfig } from './Signed';
import Digit, { TDigitConfig, defaultConfig } from './Digit';
import { TLangCode, Langs } from './lang';

type prefixPosition = 'before-signed' | 'after-signed';

export interface IConverterConfig
  extends Pick<TDigitConfig, Exclude<keyof TDigitConfig, 'placeUnit' | 'lang'>>,
    TSignedConfig {
  readonly prefix: string;
  readonly suffix: string;
  readonly prefixPosition: prefixPosition;
  readonly lang: TLangCode;
}

const defaultConverterConfig: IConverterConfig = {
  ...defaultConfig,
  ...defaultSignedConfig,
  prefix: '',
  suffix: '',
  prefixPosition: 'after-signed',
  lang: 'zh-tw'
};

function objectize(numbers: string[], config: IConverterConfig): Digit[] {
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
  text: string | number | bigint,
  userConfig: Partial<IConverterConfig> = defaultConverterConfig
): string {
  if (typeof text === 'number' || typeof text === 'bigint') {
    return main(text.toString(), userConfig);
  }

  const toNormal = (<string>text).normalize('NFKC');
  const config = { ...defaultConverterConfig, ...(userConfig || {}) };

  if (!isValidNumberText(toNormal)) {
    throw new Error('invalid number or number has exponent symbol after it has been converted. ');
  }

  if (!Langs.includes(config.lang)) {
    throw new Error('invalid lang code');
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

  let head = '';
  if (config.prefixPosition === 'after-signed') {
    head += signed + prefix;
  } else if (config.prefixPosition === 'before-signed') {
    head += prefix + signed;
  }

  return head + number + suffix;
}

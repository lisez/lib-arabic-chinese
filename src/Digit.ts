import DigitLang, { TDigitMapping } from './lang/Digit';
import { IConverterConfig } from './index';

export type TDigitConfig = {
  readonly caseType: 'lower' | 'upper';
  readonly placeUnit: number;
  readonly lang: IConverterConfig['lang'];
};

export const defaultConfig: TDigitConfig = {
  caseType: 'upper',
  placeUnit: -1,
  lang: 'zh-tw',
};

export default class Digit extends String {
  config: TDigitConfig;

  prev: Digit;
  next: Digit;

  // @ts-ignore
  constructor(digit: number | string, config: Partial<TDigitConfig> = {}) {
    // @ts-ignore
    this = new String(digit);
    // @ts-ignore
    this.__proto__ = Digit.prototype;
    // @ts-ignore
    this.config = { ...defaultConfig, ...config };

    if (String(digit).length > 1 || String(digit).length === 0) {
      throw new TypeError('invalid digit length');
    }

    if (!/^\d+$/.test(String(digit))) {
      throw new TypeError('invalid number');
    }
  }

  public setup(config: Partial<TDigitConfig>): this {
    this.config = { ...defaultConfig, ...config };
    return this;
  }

  public setPrev(digit: Digit): this {
    this.prev = digit;
    return this;
  }

  public setNext(digit: Digit): this {
    this.next = digit;
    return this;
  }

  private get isSingle(): boolean {
    return this.prev === void 0 && this.next === void 0;
  }

  private get isLargeUnit(): boolean {
    return this.config.placeUnit !== 0 && this.config.placeUnit % 4 === 0;
  }

  private get isLargeUnitVisible(): boolean {
    if (this.isLargeUnit) {
      let tokens = 2;
      let pointer = this.next;
      while (tokens >= 0 && pointer) {
        if (pointer.toNumber() !== 0) {
          return true;
        }
        pointer = pointer.next;
        tokens -= 1;
      }
      return false;
    }
    return false;
  }

  private get isZeroEnd(): boolean {
    return this.toNumber() === 0
      ? this.config.placeUnit === 0
        ? true
        : this.prev.isZeroEnd
      : false;
  }

  private get isZeroBlock(): boolean {
    return (
      this.toNumber() === 0 && this.prev !== void 0 && this.prev.toNumber() === 0 && !this.isZeroEnd
    );
  }

  private get isZeroLargeUnit(): boolean {
    return this.toNumber() === 0 && this.isLargeUnit;
  }

  private get isValueVisible(): boolean {
    if (this.toNumber() > 0 || this.isSingle) {
      return true;
    }

    if (this.config.placeUnit === 0 || this.isZeroLargeUnit || this.isZeroEnd || this.isZeroBlock) {
      return false;
    }

    return true;
  }

  private get mapping(): {
    symbol: TDigitMapping['lowerCaseMapping'] | TDigitMapping['upperCaseMapping'];
    unit: TDigitMapping['lowerCaseUnitMapping'] | TDigitMapping['upperCaseUnitMapping'];
    largeUnit: TDigitMapping['largeUnitMapping'];
  } {
    const { lang } = this.config;
    const digitMapping = DigitLang[lang];

    const symbol =
      this.config.caseType === 'lower'
        ? digitMapping.lowerCaseMapping
        : digitMapping.upperCaseMapping;
    const unit =
      this.config.caseType === 'lower'
        ? digitMapping.lowerCaseUnitMapping
        : digitMapping.upperCaseUnitMapping;

    const largeUnit = digitMapping.largeUnitMapping;

    return { symbol, unit, largeUnit };
  }

  private get unitType(): number {
    const unit = this.config.placeUnit % 4;
    return unit > 0
      ? unit
      : this.config.placeUnit > 44
        ? this.config.placeUnit % 44
        : this.config.placeUnit;
  }

  private get unit(): string {
    if (this.unitType === 0 || (this.toNumber() === 0 && !this.isLargeUnitVisible)) {
      return '';
    }

    if (this.unitType <= 3) {
      const index = String(this.unitType) as keyof (
        | TDigitMapping['lowerCaseUnitMapping']
        | TDigitMapping['upperCaseUnitMapping']
      );
      return this.mapping.unit[index];
    }

    const index = String(this.unitType) as keyof TDigitMapping['largeUnitMapping'];
    return this.mapping.largeUnit[index];
  }

  public get value(): string {
    return this.mapping.symbol[this.toNumber()];
  }

  public toString(): string {
    return (this.isValueVisible ? this.value : '') + this.unit;
  }

  public toNumber(): number {
    return Number(this);
  }
}

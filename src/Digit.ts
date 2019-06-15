export type TSymbol<T> = [T, T, T, T, T, T, T, T, T, T];

export type TUnit = '1' | '2' | '3';

export type TLargeUnit = '4' | '8' | '12' | '16' | '20' | '24' | '28' | '32' | '36' | '40' | '44';

export type TUnitMapping = { [unit in TUnit]: string };

export type TLargeUnitMapping = { [unit in TLargeUnit]: string };

export type TConfig = {
  readonly caseType: 'lower' | 'upper';
  readonly placeUnit: number;
};

export const upperCaseMapping: TSymbol<string> = [
  '零',
  '壹',
  '貳',
  '參',
  '肆',
  '伍',
  '陸',
  '柒',
  '捌',
  '玖'
];

export const lowerCaseMapping: TSymbol<string> = [
  '零',
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九'
];

export const upperCaseUnitMapping: TUnitMapping = {
  '1': '拾',
  '2': '佰',
  '3': '仟'
};

export const lowerCaseUnitMapping: TUnitMapping = {
  '1': '十',
  '2': '百',
  '3': '千'
};

export const largeUnitMapping: TLargeUnitMapping = {
  '4': '萬',
  '8': '億',
  '12': '兆',
  '16': '京',
  '20': '垓',
  '24': '秭',
  '28': '穰',
  '32': '溝',
  '36': '澗',
  '40': '正',
  '44': '載'
};

export const defaultConfig: TConfig = {
  caseType: 'upper',
  placeUnit: -1
};

export default class Digit extends String {
  config: TConfig;

  prev: Digit;
  next: Digit;

  // @ts-ignore
  constructor(digit: number | string, config: Partial<TConfig> = {}) {
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

  public setup(config: Partial<TConfig>): this {
    this.config = { ...defaultConfig, ...this.config, ...config };
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

  public get isSingle(): boolean {
    return this.prev === void 0 && this.next === void 0;
  }

  public get isLargeUnit(): boolean {
    return this.config.placeUnit % 4 === 0;
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

  private get mapping(): { symbol: TSymbol<string>; unit: TUnitMapping } {
    const symbol = this.config.caseType === 'lower' ? lowerCaseMapping : upperCaseMapping;
    const unit = this.config.caseType === 'lower' ? lowerCaseUnitMapping : upperCaseUnitMapping;

    return { symbol, unit };
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
    if (this.unitType === 0 || (this.toNumber() === 0 && (!this.isLargeUnit || this.isZeroEnd))) {
      return '';
    }

    if (this.unitType <= 3) {
      const index = String(this.unitType) as TUnit;
      return this.mapping.unit[index];
    }

    const index = String(this.unitType) as TLargeUnit;
    return largeUnitMapping[index];
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

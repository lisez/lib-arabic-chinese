import SignedLang, { TSignedMapping } from './lang/Signed';
import { IConverterConfig } from './index';

export type TSignedConfig = {
  readonly signedOutput: Partial<TSignedMapping>;
  readonly showPlusSigned: boolean;
  readonly showMinusSigned: boolean;
  readonly lang: IConverterConfig['lang'];
};

export const defaultSignedConfig: TSignedConfig = {
  showPlusSigned: false,
  showMinusSigned: true,
  signedOutput: {},
  lang: 'zh-tw'
};

export default class Signed extends String {
  public static hasSigned(string: string): boolean {
    const maybeSignedChar = string.charAt(0);
    return Signed.isPlus(maybeSignedChar) || Signed.isMinus(maybeSignedChar);
  }

  public static isPlus(string: string) {
    return string === '+';
  }

  public static isMinus(string: string) {
    return string === '-';
  }

  config: TSignedConfig;

  // @ts-ignore
  constructor(signed: string, config: RecursivePartial<TSignedConfig> = {}) {
    // @ts-ignore
    this = new String(signed);
    // @ts-ignore
    this.__proto__ = Signed.prototype;
    // @ts-ignore
    this.setup(config);

    if (String(signed).length > 1 || String(signed).length === 0) {
      throw new TypeError('invalid signed length');
    }

    // @ts-ignore
    if (!this.isPlus && !this.isMinus) {
      throw new TypeError('signed should be plus or minus');
    }
  }

  private get mapping(): { symbol: TSignedMapping } {
    let symbol = <TSignedMapping>this.config.signedOutput;
    return { symbol };
  }

  public get isPlus(): boolean {
    return Signed.isPlus(this.valueOf());
  }

  public get isMinus(): boolean {
    return Signed.isMinus(this.valueOf());
  }

  public get value(): string {
    if (this.isPlus) {
      return this.mapping.symbol['plusSigned'];
    }
    if (this.isMinus) {
      return this.mapping.symbol['minusSigned'];
    }

    return '';
  }

  private get isVisible(): boolean {
    return (
      (this.config.showPlusSigned && this.isPlus) || (this.config.showMinusSigned && this.isMinus)
    );
  }

  public setup(config: Partial<TSignedConfig> = {}): this {
    this.config = {
      ...(defaultSignedConfig || {}),
      ...(config || {}),
      signedOutput: {
        ...defaultSignedConfig.signedOutput,
        ...((config || {}).lang ? SignedLang[config.lang!] : {}),
        ...((config || {}).signedOutput || {})
      }
    };

    return this;
  }

  public toString(): string {
    return (this.isVisible && this.value) || '';
  }
}

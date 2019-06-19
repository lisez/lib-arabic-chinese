export type TSigned = 'plus' | 'minus';

export type TSignedMapping = { [signed in TSigned]: string };

export type TSignedConfig = {
  readonly showPlusSigned: boolean;
  readonly showMinusSigned: boolean;
};

export const signedMapping: TSignedMapping = {
  plus: '正',
  minus: '負'
};

export const defaultSignedConfig: TSignedConfig = {
  showPlusSigned: false,
  showMinusSigned: true
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
  constructor(signed: string, config: Partial<TSignedConfig> = {}) {
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

  public get isPlus(): boolean {
    return Signed.isPlus(this.valueOf());
  }

  public get isMinus(): boolean {
    return Signed.isMinus(this.valueOf());
  }

  public get value(): string {
    if (this.isPlus) {
      return signedMapping['plus'];
    }
    if (this.isMinus) {
      return signedMapping['minus'];
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
        ...((config || {}).signedOutput || {})
      }
    };

    return this;
  }

  public toString(): string {
    return (this.isVisible && this.value) || '';
  }
}

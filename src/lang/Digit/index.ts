import { TLangCode } from '../index';
import zhTW from './zh-tw';

export type TSymbol<T> = [T, T, T, T, T, T, T, T, T, T];

export type TUnit = '1' | '2' | '3';

export type TLargeUnit = '4' | '8' | '12' | '16' | '20' | '24' | '28' | '32' | '36' | '40' | '44';

export type TUnitMapping = { [unit in TUnit]: string };

export type TLargeUnitMapping = { [unit in TLargeUnit]: string };

export type TDigitMapping = {
  readonly upperCaseMapping: TSymbol<string>;
  readonly lowerCaseMapping: TSymbol<string>;
  readonly upperCaseUnitMapping: TUnitMapping;
  readonly lowerCaseUnitMapping: TUnitMapping;
  readonly largeUnitMapping: TLargeUnitMapping;
};

export type TDigitLang = { [langCode in TLangCode]: TDigitMapping };

const langs: TDigitLang = {
  'zh-tw': zhTW
};

export default langs;

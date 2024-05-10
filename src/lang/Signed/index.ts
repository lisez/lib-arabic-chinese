import { TLangCode } from '../index';

import zhTW from './zh-tw';
import zhCN from './zh-cn';

export type TSigned = 'plusSigned' | 'minusSigned';

export type TSignedMapping = { [signed in TSigned]: string };

export type TSignedLang = { [langCode in TLangCode]: TSignedMapping };

const langs: TSignedLang = {
  'zh-tw': zhTW,
  'zh-cn': zhCN,
};

export default langs;

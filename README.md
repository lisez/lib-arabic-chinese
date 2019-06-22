# lib-arabic-chinese

A library for converting from Arabic numbers to Chinese numbers. For example, `8,520,342,747,330,570` to `捌仟伍佰貳拾兆參仟肆佰貳拾柒億肆仟柒佰參拾參萬零伍佰柒拾`.

## Features

- Theoretically support up to `10^44`. (For now, testings only cover from `10^0` to `10^16`).
- Support `TypeScript@^3`.
- Support `Node.js` and `browser`.
- Support uppercase(ex. `壹貳參`) or lowercase(ex. `一二三`).
- Support customized prefix/suffix.
- Support customized output style of signed symbols.
- Support `Nubmer` and `BigInt`.
- Support `Traditional` and `Simplified` Chinese.

## Installation

```bash
# install by yarn
yarn add lib-arabic-chinese

# or install by npm
npm install lib-arabic-chinese
```

## Usage

Simple and easy to use:

```javascript
import converter from 'lib-arabic-chinese';
import assert from 'assert';

// simple usage
const test1 = converter('123');
assert.equal(test1, '壹佰貳拾參');

// auto drop commas
const test2 = converter('1,123');
assert.equal(test2, '壹仟壹佰貳拾參');
```

Full options for customizing:

```javascript
// lower case or upper case, default: upper
const test3 = converter('123', { caseType: 'lower' });
assert.equal(test3, '一百二十三');

// suffix and prefix, default: empty string
const test4 = converter('123', { prefix: '新台幣', suffix: '元整' });
assert.equal(test4, '新台幣壹佰貳拾參元整');

const test5 = converter('123', { prefix: '新台幣', suffix: '元整', caseType: 'lower' });
assert.equal(test5, '新台幣一百二十三元整');

// show signed or not, default: hide plus signed, show minus signed
const test6 = converter('+123');
assert.equal(test6, '壹佰貳拾參');

const test7 = converter('-123');
assert.equal(test7, '負壹佰貳拾參');

// flexible prefix position with signed, default: prefix will be placed after signed
const test8 = converter('-123', { prefix: '海拔', prefixPosition: 'before-signed' });
assert.equal(test8, '海拔負壹佰貳拾參');

// Able to customize the output of signed symbols, default: 正 for plus, 負 for minus
const test9 = converter('-123', { signedOutput: { minusSigned: '下降' } });
assert.equal(test9, '下降壹佰貳拾參');

// Support Simplified/Traditional Chinese, default: `zh-tw`
const test10 = converter('-123', { lang: 'zh-cn' });
assert.equal(test10, '负壹佰贰十参');

```

### `Important`: BigInt and Number

The conveter could be passed `Number` or `BigInt` now. But it only calls `Number.prototype.toString` and `BigInt.prototype.toString` methods to make a `String`. Then **it might be occurred some unexpected behaviours while it calls if the number is overflowed.**

For example:

```bash
> Number(Number.MAX_SAFE_INTEGER).toString()
'9007199254740991'
> Number(Math.pow(2,69)).toString()
'590295810358705700000'
> Number(Math.pow(2,70)).toString()
'1.1805916207174113e+21'
> BigInt(Math.pow(2,70)).toString()
'1180591620717411303424'
```

`Node.js` will convert `Number(Math.pow(2,70))` into `1.1805916207174113e+21`. It is unable to convert to Chinese number format. So, the converter now will throw an error. But if it is `BigInt`, it will be safely to convert to a clearly number. However, **it also has to be mentioned the overflow issue with `BigInt`.**

## Options

The default configuration options would be:

```javascript
{ caseType: 'upper', // `upper` | `lower`
  lang: 'zh-tw', // 'zh-tw' | 'zh-cn'
  showPlusSigned: false,
  showMinusSigned: true,
  signedOutput: { },
  prefix: '',
  suffix: '',
  prefixPosition: 'after-signed' // `after-signed` | `before-signed`
}
```

## Todo & Roadmap

- [x] Support Simple Chinese. (ex. `億/亿`)
- [x] Support Positive numbers (integer).
- [x] Support Negative numbers (integer).
- [ ] Support Floating numbers. (ex. `3.14` to `三點一四`)
- [ ] Support Fraction numbers. (ex. `4/5` to `五分之四`)
- [ ] Support Mixing numbers. (ex. `4,500萬` to `四千五百萬`)
- [ ] Support Metric unit rule.

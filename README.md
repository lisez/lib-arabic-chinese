# lib-arabic-chinese

A library for converting from Arabic numbers to Chinese numbers. For example, `8,520,342,747,330,570` to `捌仟伍佰貳拾兆參仟肆佰貳拾柒億肆仟柒佰參拾參萬零伍佰柒拾`.

## Features

- Theoretically support up to `10^44`. (For now, testings only cover from `10^0` to `10^16`).
- Support `TypeScript@^3`.
- Support `Node.js` and `browser`.
- Support uppercase(ex. `壹貳參`) or lowercase(ex. `一二三`).
- Support customized prefix/suffix.

## Installation

```bash
# install by yarn
yarn add lib-arabic-chinese

# or install by npm
npm install lib-arabic-chinese
```

## Usage

```javascript
import converter from 'lib-arabic-chinese';
import assert from 'assert';

// simple usage
const test1 = converter('123');
assert.equal(test1, '壹佰貳拾參');

// auto drop commas
const test2 = converter('1,123');
assert.equal(test2, '壹仟壹佰貳拾參');

// with options
const test3 = converter('123', { caseType: 'lower' });
assert.equal(test3, '一百二十三');

const test4 = converter('123', { prefix: '新台幣', suffix: '元整' });
assert.equal(test4, '新台幣壹佰貳拾參元整');

const test5 = converter('123', { prefix: '新台幣', suffix: '元整', caseType: 'lower' });
assert.equal(test5, '新台幣一百二十三元整');
```

## Todo & Roadmap

- [ ] Support Simple Chinese. (ex. `億/亿`)
- [x] Support Positive numbers (integer).
- [ ] Support Negative numbers (integer).
- [ ] Support Floating numbers. (ex. `3.14` to `三點一四`)
- [ ] Support Fraction numbers. (ex. `4/5` to `五分之四`)
- [ ] Support Mixing numbers. (ex. `4,500萬` to `四千五百萬`)

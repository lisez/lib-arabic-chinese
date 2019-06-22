import converter from '../src/index';
import assert from 'assert';

// simple usage
const test1 = converter('123');
assert.equal(test1, '壹佰貳拾參');

// auto drop commas
const test2 = converter('1,123');
assert.equal(test2, '壹仟壹佰貳拾參');

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

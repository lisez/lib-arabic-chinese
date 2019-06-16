import converter from '../src/index';
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

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { describe, expect, test } from 'vitest';

type Converter = typeof import('../src/index').default;
const require = createRequire(import.meta.url);

function checkConverter(converter: Converter) {
  expect(typeof converter).toBe('function');
  expect(converter('123')).toBe('壹佰貳拾參');
  expect(converter(-123, { lang: 'zh-cn' })).toBe('负壹佰贰拾参');
  expect(converter(BigInt(123), { caseType: 'lower' })).toBe('一百二十三');
  expect(() => converter('invalid')).toThrow();
}

describe('package entry points', () => {
  test('CommonJS require returns the callable converter', () => {
    checkConverter(require('../dist/index.js') as Converter);
  });

  test('browser script exposes the callable libArabicChinese global', () => {
    const context: { libArabicChinese?: Converter } = {};
    runInNewContext(readFileSync(resolve('dist/index.js'), 'utf8'), context);
    checkConverter(context.libArabicChinese!);
  });

  test('AMD registers the existing named module', () => {
    let moduleId: string | undefined;
    let converter: Converter | undefined;
    const define = Object.assign(
      (id: string, _dependencies: string[], factory: () => Converter) => {
        moduleId = id;
        converter = factory();
      },
      { amd: true },
    );
    runInNewContext(readFileSync(resolve('dist/index.js'), 'utf8'), { define });
    expect(moduleId).toBe('libArabicChinese');
    checkConverter(converter!);
  });

  test('native ESM has a callable default export', () => {
    const entry = new URL('../dist/index.mjs', import.meta.url).href;
    const output = execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `
      import converter from ${JSON.stringify(entry)};
      import assert from 'node:assert/strict';
      assert.equal(typeof converter, 'function');
      assert.equal(converter('123'), '壹佰貳拾參');
      assert.equal(converter(-123, { lang: 'zh-cn' }), '负壹佰贰拾参');
      assert.equal(converter(BigInt(123), { caseType: 'lower' }), '一百二十三');
      assert.throws(() => converter('invalid'));
    `,
      ],
      { encoding: 'utf8' },
    );
    expect(output).toBe('');
  });
});

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const directory = mkdtempSync(join(tmpdir(), 'lib-arabic-chinese-package-'));
// Let the isolated npm commands resolve their own configuration.
const npmEnvironment = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => !key.toLowerCase().startsWith('npm_config_')),
);
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
try {
  const [pack] = JSON.parse(
    execFileSync(npm, ['pack', '--ignore-scripts', '--json', '--pack-destination', directory], {
      encoding: 'utf8',
      env: npmEnvironment,
    }),
  ) as { filename: string; files: { path: string }[] }[];
  const paths = pack.files.map((file) => file.path);
  for (const path of [
    'dist/index.js',
    'dist/index.mjs',
    'dist/index.d.ts',
    'dist/index.d.cts',
    'dist/index.d.mts',
    'dist/types.d.ts',
  ]) {
    assert(paths.includes(path), `Missing package file: ${path}`);
  }
  assert(!paths.some((path) => /^(tests|demo|scripts)\//.test(path)));
  writeFileSync(join(directory, 'package.json'), '{"private":true}');
  execFileSync(
    npm,
    [
      'install',
      '--offline',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
      '--prefix',
      directory,
      join(directory, pack.filename),
    ],
    { stdio: 'inherit', env: npmEnvironment },
  );
  for (const extension of ['cts', 'mts']) {
    writeFileSync(
      join(directory, `consumer.${extension}`),
      `
      import converter, { type IConverterConfig } from 'lib-arabic-chinese';
      const options: Partial<IConverterConfig> = { lang: 'zh-tw', caseType: 'lower' };
      const output: string = converter(123n, options);
      console.log(output);
    `,
    );
  }
  writeFileSync(
    join(directory, 'native.mts'),
    `
    import converter, { type IConverterConfig } from 'lib-arabic-chinese/dist/index.mjs';
    const options: Partial<IConverterConfig> = { lang: 'zh-tw', caseType: 'lower' };
    const output: string = converter(123n, options);
    console.log(output);
  `,
  );
  writeFileSync(
    join(directory, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        strict: true,
        target: 'ES2020',
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        outDir: './output',
        types: [],
      },
      include: ['consumer.cts', 'consumer.mts', 'native.mts'],
    }),
  );
  execFileSync(process.execPath, [resolve('node_modules/typescript/bin/tsc'), '-p', directory], {
    stdio: 'inherit',
  });
  for (const extension of ['cjs', 'mjs']) {
    assert.equal(
      execFileSync(process.execPath, [join(directory, `output/consumer.${extension}`)], {
        encoding: 'utf8',
      }).trim(),
      '一百二十三',
    );
  }
  assert.equal(
    execFileSync(process.execPath, [join(directory, 'output/native.mjs')], {
      encoding: 'utf8',
    }).trim(),
    '一百二十三',
  );
  // Check declarations under bundler module resolution as well.
  execFileSync(
    process.execPath,
    [
      resolve('node_modules/typescript/bin/tsc'),
      '-p',
      directory,
      '--module',
      'ESNext',
      '--moduleResolution',
      'Bundler',
      '--noEmit',
    ],
    { stdio: 'inherit' },
  );
  console.log('Package contents, CommonJS/ESM consumers, and declarations verified.');
} finally {
  rmSync(directory, { recursive: true, force: true });
}

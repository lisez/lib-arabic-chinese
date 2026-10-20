import { writeFileSync } from 'node:fs';

writeFileSync(
  new URL('../dist/index.d.cts', import.meta.url),
  `declare const converter: typeof import('./index.js').default;
declare namespace converter {
  type IConverterConfig = import('./index.js').IConverterConfig;
}
export = converter;
`,
);
writeFileSync(
  new URL('../dist/index.d.mts', import.meta.url),
  `declare const converter: typeof import('./index.js').default;
export default converter;
export type { IConverterConfig } from './index.js';
`,
);

import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    {
      name: 'preserve-named-amd-entry',
      renderChunk(code, _chunk, options) {
        if (options.format !== 'umd') return null;
        // Rolldown currently emits anonymous AMD; retain the existing module ID.
        const anonymousDefine = /\bdefine\(\[\],\s*/;
        if (!anonymousDefine.test(code)) {
          throw new Error('Cannot locate the UMD AMD registration');
        }
        return {
          code: code.replace(anonymousDefine, 'define("libArabicChinese", [], '),
          map: null,
        };
      },
    },
  ],
  build: {
    target: 'es2015',
    lib: {
      entry: 'src/index.ts',
      name: 'libArabicChinese',
      formats: ['es', 'umd'],
      fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.js'),
    },
    rolldownOptions: {
      output: { exports: 'default' },
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});

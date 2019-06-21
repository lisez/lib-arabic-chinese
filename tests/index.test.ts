import Converter, { IConverterConfig } from '../src/index';
import TestCases from './testcases.json';

for (const testset of TestCases) {
  describe(testset.set, () => {
    for (let [tNumber, eValue] of Object.entries(testset.data)) {
      test(`(String) ${tNumber} -> ${eValue}`, () => {
        const aValue = Converter(tNumber, <IConverterConfig>(testset.options || {}));
        expect(aValue).toEqual(eValue);
      });

      // to Number
      if (!tNumber.startsWith('+')) {
        const noComma = tNumber.replace(/,/g, '');
        const toNumber = Number(noComma);
        if (toNumber <= Number.MAX_SAFE_INTEGER && !Number.isNaN(toNumber)) {
          test(`(Number) ${toNumber.toString()} -> ${eValue}`, () => {
            const opts = <IConverterConfig>(testset.options || {});
            const nValue = Converter(toNumber, opts);
            expect(nValue).toEqual(eValue);
          });
        } else if (BigInt) {
          const toBigInt = BigInt(noComma);
          test(`(BigInt) ${toBigInt.toString()} -> ${eValue}`, () => {
            const opts = <IConverterConfig>(testset.options || {});
            const nValue = Converter(toBigInt, opts);
            expect(nValue).toEqual(eValue);
          });
        }
      }
    }
  });
}

import Converter, { IConverterConfig } from '../src/index';
import TestCases from './testcases.json';

for (const testset of TestCases) {
  describe(testset.set, () => {
    for (let [tNumber, eValue] of Object.entries(testset.data)) {
      test(`${tNumber} -> ${eValue}`, () => {
        const aValue = Converter(tNumber, <IConverterConfig>testset.options || {});
        expect(aValue).toEqual(eValue);
      });
    }
  });
}

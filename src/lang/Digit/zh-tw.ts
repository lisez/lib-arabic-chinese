import { TDigitMapping } from './index';

const mapping: TDigitMapping = {
  upperCaseMapping: ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖'],

  lowerCaseMapping: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],

  upperCaseUnitMapping: {
    '1': '拾',
    '2': '佰',
    '3': '仟'
  },

  lowerCaseUnitMapping: {
    '1': '十',
    '2': '百',
    '3': '千'
  },

  largeUnitMapping: {
    '4': '萬',
    '8': '億',
    '12': '兆',
    '16': '京',
    '20': '垓',
    '24': '秭',
    '28': '穰',
    '32': '溝',
    '36': '澗',
    '40': '正',
    '44': '載'
  }
};

export default mapping;

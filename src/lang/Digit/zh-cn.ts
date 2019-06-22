import { TDigitMapping } from './index';

const mapping: TDigitMapping = {
  upperCaseMapping: ['零', '壹', '贰', '参', '肆', '伍', '陆', '柒', '捌', '玖'],

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
    '4': '万',
    '8': '亿',
    '12': '兆',
    '16': '京',
    '20': '垓',
    '24': '秭',
    '28': '穰',
    '32': '沟',
    '36': '涧',
    '40': '正',
    '44': '载'
  }
};

export default mapping;

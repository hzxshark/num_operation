'use strict';
const expect = require('chai').expect;
const plus = require('../index').plus;
const times = require('../index').times;
const minus = require('../index').minus;
const divide = require('../index').divide;
const strip = require('../index').strip;
const digitLength = require('../index').digitLength;
const digitToCNchar = require('../index').digitToCNchar;

// 加法测试
describe('num_operation function test', () => {
  it('should return 0.3', () => {
    const result = plus(0.1, 0.2);
    expect(result).to.equal(0.3);
  });
});

// 乘法测试
describe('num_operation function test', () => {
  it('should return 0.02', () => {
    const result = times(0.1, 0.2);
    expect(result).to.equal(0.02);
  });
});

// 减法测试
describe('num_operation function test', () => {
  it('should return 0.1', () => {
    const result = minus(0.3, 0.2);
    expect(result).to.equal(0.1);
  });
});

// 除法测试
describe('num_operation function test', () => {
  it('should return 1.5', () => {
    const result = divide(0.3, 0.2);
    expect(result).to.equal(1.5);
  });
});

// 错误数据校正测试
describe('num_operation function test', () => {
  it('should return 0.3', () => {
    const result = strip(0.1+0.2);
    expect(result).to.equal(0.3);
  });
});

// 获取数字长度测试
describe('num_operation function test', () => {
  it('should return 5', () => {
    const result = digitLength(0.00003);
    expect(result).to.equal(5);
  });
});

// 中文大写格式化测试
describe('num_operation function test', () => {
  it('should return 壹拾贰元伍角', () => {
    const result = digitToCNchar(12.5);
    expect(result).to.equal('壹拾贰元伍角');
  });
});
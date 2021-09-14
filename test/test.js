'use strict';
const expect = require('chai').expect;
const plus = require('../index').plus;
const digitToCNchar = require('../index').digitToCNchar;

describe('num_operation function test', () => {
  it('should return 0.3', () => {
    const result = plus(0.1, 0.2);
    expect(result).to.equal(0.3);
  });
});


describe('num_operation function test', () => {
  it('should return 壹拾贰元伍角', () => {
    const result = digitToCNchar(12.5);
    expect(result).to.equal('壹拾贰元伍角');
  });
});
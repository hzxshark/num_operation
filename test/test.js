'use strict';
const expect = require('chai').expect;
const plus = require('../index').plus;

describe('num_operation function test', () => {
  it('should return 0.3', () => {
    const result = plus(0.1, 0.2);
    expect(result).to.equal(0.3);
  });
});
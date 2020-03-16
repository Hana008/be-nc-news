const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

/*
This utility function should be able to take an array (list) of objects and return a new array. Each item in the new array must have its timestamp converted into a Javascript date object. Everything else in each item must be maintained.

hint: Think carefully about how you can test that this has worked - it's not by copying and pasting a sql timestamp from the terminal into your test
*/
describe('formatDates', () => {
  it('returns an empty array when passed an empty array', () => {
    expect(formatDates([])).to.eql([])
  });
  it('does not mutate original input and returns a new array with a different reference point in memory', () => {
    const input = [{}];
    formatDates(input);
    expect(input).to.eql([{}]);
    expect(formatDates(input)).to.not.equal(input)
  });
  it('returns a new formatted object in an array with the timestamp converted into a Javascript date object when passed an array containing an object with a key value pair for a timestamp', () => {
    const input = [{ author: 'Hana', }];
  });
});

describe('makeRefObj', () => {
  it('returns an empty array when passed an empty array', () => {
    expect(makeRefObj([])).to.eql([])
  });
  it('does not mutate original input and returns a new array with a different reference point in memory', () => {
    const input = [];
    makeRefObj(input);
    expect(input).to.eql([]);
    expect(makeRefObj(input)).to.not.equal(input)
  });
  it('returns a reference object using the values of id and title when passed an array containing an object with keys of id and title', () => {
    const input = [{ article_id: 1, title: 'A' }];
    const expected = { A: 1 };
    expect(makeRefObj(input)).to.eql(expected)
  });
  it('returns a reference object using the values of id and title when passed an array containing multiple object with keys of id and title', () => {
    const input = [{ article_id: 1, title: 'A' }, { article_id: 2, title: 'B' }, {article_id: 3, title: 'C' }, { article_id: 4, title: 'D' }];
    const expected = {
      A: 1,
      B: 2,
      C: 3, 
      D: 4
    }
    expect(makeRefObj(input)).to.eql(expected)
  });
});

describe('formatComments', () => {});

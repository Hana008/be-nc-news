const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

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
    const input = [{ author: 'Hana', created_at: 1584373012266 }];
    const expected = [{ author: 'Hana', created_at: new Date(1584373012266) }];
    expect(formatDates(input)).to.eql(expected)
  });
  it('returns new formatted objects in an array with the timestamp converted into a Javascript date object when passed an array containing objects with a key value pair for a timestamp', () => {
    const input = [
      {
        author: "Hana",
        created_at: 1542284514171,
      },
      {
        author: "Mohamed",
        created_at: 1416140514171,
      }
    ]
    const expected = [
      {
        author: "Hana",
        created_at: new Date(1542284514171),
      },
      {
        author: "Mohamed",
        created_at: new Date(1416140514171),
      }
    ]
    expect(formatDates(input)).to.eql(expected)
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
    const input = [{ article_id: 1, title: 'A' }, { article_id: 2, title: 'B' }, { article_id: 3, title: 'C' }, { article_id: 4, title: 'D' }];
    const expected = {
      A: 1,
      B: 2,
      C: 3,
      D: 4
    }
    expect(makeRefObj(input)).to.eql(expected)
  });
});

describe.only('formatComments', () => {
  it('returns an empty array when passed an empty array', () => {
    expect(formatComments([])).to.eql([])
  });
  it('returns an array with a formatted object when passed an array containing an object, a reference object and the formatDates function', () => {

    const input = [{
      comment_id: 1,
      created_by: 'name',
      belongs_to: 'title',
      votes: 0,
      created_at: 1542284514171,
      body: 'TEXT'
    }];

    const articleRefObj = {
      'title': 9
    };

    const expected = [{
      comment_id: 1,
      author: 'name',
      article_id: 9,
      votes: 0,
      created_at: new Date(1542284514171),
      body: 'TEXT'
    }];

    expect(formatComments(input, articleRefObj, formatDates)).to.eql(expected)

  });
  it('returns an array with formatted objects when passed an array containing multiple objects, a reference object and the formatDates function', () => {
    const input = [{
      comment_id: 1,
      created_by: 'name',
      belongs_to: 'title',
      votes: 0,
      created_at: 1542284514171,
      body: 'TEXT'
    },
    {
      comment_id: 2,
      created_by: 'name',
      belongs_to: 'title1',
      votes: 0,
      created_at: 1542284514171,
      body: 'TEXT'
    },
    {
      comment_id: 3,
      created_by: 'name',
      belongs_to: 'title2',
      votes: 0,
      created_at: 1542284514171,
      body: 'TEXT'
    },
    {
      comment_id: 4,
      created_by: 'name',
      belongs_to: 'title3',
      votes: 0,
      created_at: 1542284514171,
      body: 'TEXT'
    }
  ];

    const articleRefObj = {
      'title': 9,
      'title1': 2,
      'title2': 3,
      'title3': 4
    };

    const expected = [{
      comment_id: 1,
      author: 'name',
      article_id: 9,
      votes: 0,
      created_at: new Date(1542284514171),
      body: 'TEXT'
    },
    {
      comment_id: 2,
      author: 'name',
      article_id: 2,
      votes: 0,
      created_at: new Date(1542284514171),
      body: 'TEXT'
    },
    {
      comment_id: 3,
      author: 'name',
      article_id: 3,
      votes: 0,
      created_at: new Date(1542284514171),
      body: 'TEXT'
    },
    {
      comment_id: 4,
      author: 'name',
      article_id: 4,
      votes: 0,
      created_at: new Date(1542284514171),
      body: 'TEXT'
    }
  ];

    expect(formatComments(input, articleRefObj, formatDates)).to.eql(expected)
  });
  it('does not mutate original input nor change the reference object and returns a new array array with a different reference point in memory', () => {
    const input = [{
      comment_id: 1,
      created_by: 'name',
      belongs_to: 'title',
      votes: 0,
      created_at: 1542284514171,
      body: 'TEXT'
    }];

    const articleRefObj = {
      'title': 9
    };

    formatComments(input, articleRefObj, formatDates)
    expect(input).to.eql([{
      comment_id: 1,
      created_by: 'name',
      belongs_to: 'title',
      votes: 0,
      created_at: 1542284514171,
      body: 'TEXT'
    }]);
    expect(articleRefObj).to.eql({
      'title': 9
    });
    expect(formatComments(input, articleRefObj, formatDates)).to.not.equal(input)
  });
});

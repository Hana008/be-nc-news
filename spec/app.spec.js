process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest');
const chai = require('chai');
const chaiSorted = require('chai-sorted');
const { expect } = chai;
chai.use(chaiSorted);
const connection = require('../db/connection')

describe('/api', () => {
    beforeEach(() => connection.seed.run());
    after(() => connection.destroy());
    describe('/topics', () => {
        it('GET returns status code 200 and an object with the key of topics and value of an array with the topics data as objects that have all properties', () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then(res => {
                    expect(res.body.topics).to.be.an('array');
                    expect(res.body.topics[0]).to.contain.keys('slug', 'description');
                });
        });
    })
    describe('/users/:username', () => {
        it('GET returns status code 200 and an object with the key of users and value of an array with the users data as an object that has all properties', () => {
            return request(app)
                .get('/api/users/lurker')
                .expect(200)
                .then(res => {
                    expect(res.body.user).to.be.an('array');
                    expect(res.body.user[0]).to.contain.keys('username', 'avatar_url', 'name');
                });
        });
    });
    describe('/articles', () => {
        it('GET returns 200 and an object with a key of articles and value of an array with the article data as objects with all properties present', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(res => {
                    expect(res.body.articles).to.be.an('array');
                    expect(res.body.articles.forEach(article => {
                        expect(article).to.contain.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count')
                    }))
                });
        });
        it('GET returns 200 and an object with a key of articles and value of an array with the article data as objects with all properties present and sorted by the query column', () => {
            return request(app)
                .get('/api/articles?sort_by=article_id')
                .expect(200)
                .then(res => {
                    expect(res.body.articles).to.be.an('array');
                    expect(res.body.articles.forEach(article => {
                        expect(article).to.contain.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count')
                    }));
                    expect(res.body.articles).to.be.sortedBy('article_id', { descending: true });
                });
        });
        it('GET returns 200 and an object with a key of articles and value of an array with the article data as objects with all properties present and default sorted by date created when no user query present to specify', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(res => {
                    expect(res.body.articles).to.be.an('array');
                    expect(res.body.articles.forEach(article => {
                        expect(article).to.contain.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count')
                    }));
                    expect(res.body.articles).to.be.sortedBy('created_at', { descending: true });
                });
        });
        it('GET returns 200 and an object with a key of articles and value of an array with the article data as objects with all properties present and sorted by the query column and order', () => {
            return request(app)
                .get('/api/articles?sort_by=author&order=asc')
                .expect(200)
                .then(res => {
                    expect(res.body.articles).to.be.an('array');
                    expect(res.body.articles.forEach(article => {
                        expect(article).to.contain.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count')
                    }));
                    expect(res.body.articles).to.be.sortedBy('author', { ascending: true })
                });
        });
        it('GET returns 200 and an object with a key of articles and value of an array with the article data as objects with all properties present and sorted by the query column and defaults to descending order when order is not queried', () => {
            return request(app)
                .get('/api/articles?sort_by=title')
                .expect(200)
                .then(res => {
                    expect(res.body.articles).to.be.an('array');
                    expect(res.body.articles.forEach(article => {
                        expect(article).to.contain.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count')
                    }));
                    expect(res.body.articles).to.be.sortedBy('title', { descending: true })
                });
        });
        it('GET returns 200 and an object with a key of articles and value of an array with article data for the author queried as objects with all properties present', () => {
            return request(app)
                .get('/api/articles?author=butter_bridge')
                .expect(200)
                .then(res => {
                    expect(res.body.articles).to.be.an('array');
                    expect(res.body.articles.forEach(article => {
                        expect(article).to.contain.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count')
                    }));
                    expect(res.body.articles.forEach(article => {
                        expect(article.author).to.equal('butter_bridge')
                    }))
                    expect(res.body.articles.length).to.equal(3)
                });
        });
        it('GET returns 200 and an object with a key of articles and value of an array with article data for the topic queried as objects with all properties present', () => {
            return request(app)
                .get('/api/articles?topic=cats')
                .expect(200)
                .then(res => {
                    expect(res.body.articles).to.be.an('array');
                    expect(res.body.articles.forEach(article => {
                        expect(article).to.contain.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count')
                    }));
                    expect(res.body.articles.forEach(article => {
                        expect(article.topic).to.equal('cats')
                    }))
                    expect(res.body.articles.length).to.equal(1)
                });
        });
        describe('/:article_id', () => {
            it('GET returns status code 200 and an object with a key of article and value of an array with the article data as an object that has all properties', () => {
                return request(app)
                    .get('/api/articles/1')
                    .expect(200)
                    .then(res => {
                        expect(res.body.article).to.be.an('array');
                        expect(res.body.article[0]).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count');
                    });
            });
            it('PATCH returns status code 201 and an object with a key of article and value of an array with the article data containing all properties and the votes property adjusted by the value passed in', () => {
                return request(app)
                    .patch('/api/articles/1')
                    .send({ inc_votes: -1 })
                    .expect(201)
                    .then(res => {
                        expect(res.body.article).to.be.an('array');
                        expect(res.body.article[0]).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes');
                        expect(res.body.article[0].votes).to.equal(99);
                    });
            });
            describe('/comments', () => {
                it('POST returns status code 201 and an object with the key of comment and value of an array with an object containing the posted comment', () => {
                    return request(app)
                        .post('/api/articles/1/comments')
                        .send({ username: 'lurker', body: 'text' })
                        .expect(201)
                        .then(res => {
                            expect(res.body.comment).to.be.an('array');
                            expect(res.body.comment[0].comment_id).to.eql(19);
                            expect(res.body.comment[0].author).to.equal('lurker');
                            expect(res.body.comment[0].article_id).to.equal(1);
                            expect(res.body.comment[0].votes).to.equal(0);
                            //   expect(res.body.comment[0].created_at).to.eql()
                        });
                });
                it('GET returns status code 200 and an object with the key of comments and value of an array of comments as objects containing all properties', () => {
                    return request(app)
                        .get('/api/articles/1/comments')
                        .expect(200)
                        .then(res => {
                            expect(res.body.comments).to.be.an('array');
                            expect(res.body.comments.length).to.equal(13);
                            expect(res.body.comments.forEach(comment => {
                                expect(comment).to.contain.keys('comment_id', 'votes', 'created_at', 'author', 'body');
                            }));
                        });
                });
                it("GET returns 200 and an object with the key of comments and value of an array of comments as objects containing all properties in order of the query's column passed in", () => {
                    return request(app)
                        .get('/api/articles/1/comments?sort_by=votes')
                        .expect(200)
                        .then(res => {
                            expect(res.body.comments).to.be.an('array');
                            expect(res.body.comments).to.be.sortedBy('votes', { descending: true });
                            //test for all keys
                        });
                });
                it('GET returns 200 and an object with the key of comments and value of an array of comments as objects containing all properties in a default order of the column "created_at" when a sort_by query is not passed', () => {
                    return request(app)
                        .get('/api/articles/1/comments')
                        .expect(200)
                        .then(res => {
                            expect(res.body.comments).to.be.an('array');
                            expect(res.body.comments).to.be.sortedBy('created_at', { descending: true });
                            //test for all keys
                        });
                });
                it("GET returns 200 and an object with the key of comments and value of an array of comments as objects containing all properties in order of the query's column and order passed in", () => {
                    return request(app)
                        .get('/api/articles/1/comments?sort_by=comment_id&order=asc')
                        .expect(200)
                        .then(res => {
                            expect(res.body.comments).to.be.an('array');
                            expect(res.body.comments).to.be.sortedBy('comment_id', { ascending: true });
                            //test for all keys
                        });
                });
                it("GET returns 200 and an object with the key of comments and value of an array of comments as objects containing all properties in order of the query's column in a default descending order when order query is not passed in to specify'", () => {
                    return request(app)
                        .get('/api/articles/1/comments?sort_by=author')
                        .expect(200)
                        .then(res => {
                            expect(res.body.comments).to.be.an('array');
                            expect(res.body.comments).to.be.sortedBy('author', { descending: true });
                            //test for all keys
                        });
                });
            });
        });
    });
    describe('/comments', () => {
        describe('/:comment_id', () => {
            it('PATCH returns status code 201 and n object with the key of comments and value of an array containing a comment as an object that has all properties when passed an object with a property value of a number that the comments vote should be adjusted by', () => {
                return request(app)
                    .patch('/api/comments/1')
                    .send({ inc_votes: -1 })
                    .expect(201)
                    .then(res => {
                        expect(res.body.comment).to.be.an('array');
                        expect(res.body.comment[0]).to.contain.keys('comment_id', 'author', 'article_id', 'votes', 'created_at', 'body');
                        expect(res.body.comment[0].votes).to.equal(15);
                    });
            });
            it('DELETE returns status code 204 and no content', () => {
                return request(app)
                .delete('/api/comments/1')
                .expect(204)
            });
        });
    });
});
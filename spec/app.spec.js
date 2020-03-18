process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest');
const { expect } = require('chai');
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
    describe('/users', () => {
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
                    expect(res.body.article[0].votes).to.eql(99);
                });
        });
        it('POST returns status code 201 and an object with the key of comment and value of an array with an object containing the posted comment', () => {
            return request(app)
                .post('/api/articles/1/comments')
                .send({ username: 'lurker', body: 'text' })
                .expect(201)
                .then(res => {
                    expect(res.body.comment).to.be.an('array');
                    expect(res.body.comment[0].comment_id).to.eql(19);
                    expect(res.body.comment[0].author).to.eql('lurker');
                    expect(res.body.comment[0].article_id).to.eql(1);
                    expect(res.body.comment[0].votes).to.eql(0);
                    //   expect(res.body.comment[0].created_at).to.eql()
                });
        });
    });
});
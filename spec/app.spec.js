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
    it('DELETE returns 405 and error message', () => {
        return request(app)
            .delete('/api')
            .expect(405)
            .then(res => {
                expect(res.body).to.eql({ msg: 'method not allowed' });
            });
    });
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
        it('PATCH returns status code 405 and message', () => {
            return request(app)
                .patch('/api/topics')
                .expect(405)
                .then(res => {
                    expect(res.body).to.eql({ msg: 'method not allowed' });
                });
        });
    })
    describe('/users/:username', () => {
        it('GET returns status code 200 and an object with the key of users and value of an array with the users data as an object that has all properties', () => {
            return request(app)
                .get('/api/users/lurker')
                .expect(200)
                .then(res => {
                    expect(res.body.user).to.be.an('object');
                    expect(res.body.user).to.contain.keys('username', 'avatar_url', 'name');
                });
        });
        it('GET returns status code 404 and message when user queries a non-existent username', () => {
            return request(app)
                .get('/api/users/not-a-username')
                .expect(404)
                .then(res => {
                    expect(res.body).to.eql({ msg: 'column not found!' })
                });
        });
        it('PUT returns status code 405 and message when using an invalid method', () => {
            return request(app)
                .put('/api/users/lurker')
                .expect(405)
                .then(res => {
                    expect(res.body).to.eql({ msg: 'method not allowed' });
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
        it('GET returns SOMETHINGG when a query to sort a non-existing column is requested', () => {
            return request(app)
                .get('/api/articles?sort_by=not-a-column')
                .expect(400)
                .then(res => {
                    expect(res.body).to.eql({ msg: 'column does not exist!' });
                })
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
        it('GET returns 200 and an object with a key of articles and value of an array with article data in the order queried as objects with all properties present', () => {
            return request(app)
                .get('/api/articles?order=asc')
                .expect(200)
                .then(res => {
                    expect(res.body.articles).to.be.an('array');
                    expect(res.body.articles.forEach(article => {
                        expect(article).to.contain.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count')
                    }));
                    expect(res.body.articles).to.be.sortedBy('created_at', { ascending: true })
                });
        });
        it('PATCH returns status code 405 and message', () => {
            return request(app)
                .patch('/api/articles')
                .expect(405)
                .then(res => {
                    expect(res.body).to.eql({ msg: 'method not allowed' });
                });
        });
        it('GET returns status code 404 and message when user queries a non existing topic', () => {
            return request(app)
                .get('/api/articles?topic=not-a-topic')
                .expect(404)
                .then(res => {
                    expect(res.body).to.eql({ msg: 'column not found!' });
                });
        });
        it('GET returns status code 404 and message when user queries a non existing author', () => {
            return request(app)
                .get('/api/articles?author=not-an-author')
                .expect(404)
                .then(res => {
                    expect(res.body).to.eql({ msg: 'column not found!' });
                });
        });
        it('GET returns status code 200 and an empty array when an existing author is queried but has no articles published', () => {
            return request(app)
                .get('/api/articles?author=lurker')
                .expect(200)
                .then(res => {
                    expect(res.body.articles).to.eql([]);
                })
        });
        it('GET returns status code 200 and an empty array when an existing topic is queried but has no articles', () => {
            return request(app)
                .get('/api/articles?topic=paper')
                .expect(200)
                .then(res => {
                    expect(res.body.articles).to.eql([]);
                })
        });
        describe('/:article_id', () => {
            it('GET returns status code 200 and an object with a key of article and value of an array with the article data as an object that has all properties', () => {
                return request(app)
                    .get('/api/articles/1')
                    .expect(200)
                    .then(res => {
                        expect(res.body.article).to.be.an('object');
                        expect(res.body.article).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count');
                        expect(res.body.article.comment_count).to.equal(5)
                    });
            });
            it('PATCH returns status code 201 and an object with a key of article and value of an array with the article data containing all properties and the votes property adjusted by the value passed in', () => {
                return request(app)
                    .patch('/api/articles/1')
                    .send({ inc_votes: -1 })
                    .expect(200)
                    .then(res => {
                        expect(res.body.article).to.be.an('object');
                        expect(res.body.article).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes');
                        expect(res.body.article.votes).to.equal(99);
                    });
            });
            it('PATCH returns status code 200 and an unchanged article when no request body is sent', () => {
                return request(app)
                    .patch('/api/articles/1')
                    .expect(200)
                    .then(res => {
                        expect(res.body.article).to.be.an('object');
                        expect(res.body.article).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes');
                        expect(res.body.article.votes).to.equal(100);
                    });
            });
            it('PATCH returns status code 400 and informative message when an invalid value is passed in to adjust votes', () => {
                return request(app)
                    .patch('/api/articles/1')
                    .send({ inc_votes: 'invalid value' })
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.eql({ msg: 'invalid data type!' });
                    })
            });
            it('PUT returns status code 405 and message', () => {
                return request(app)
                    .put('/api/articles/1')
                    .expect(405)
                    .then(res => {
                        expect(res.body).to.eql({ msg: 'method not allowed' });
                    })
            });
            it('GET returns status code 400 and informative message when an invalid id is requested', () => {
                return request(app)
                    .get('/api/articles/invalid-id')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.eql({ msg: 'invalid data type!' });
                    })
            });
            describe('/comments', () => {
                it('POST returns status code 201 and an object with the key of comment and value of an array with an object containing the posted comment', () => {
                    return request(app)
                        .post('/api/articles/1/comments')
                        .send({ username: 'lurker', body: 'text' })
                        .expect(201)
                        .then(res => {
                            expect(res.body.comment).to.be.an('object');
                            expect(res.body.comment.comment_id).to.eql(19);
                            expect(res.body.comment.author).to.equal('lurker');
                            expect(res.body.comment.article_id).to.equal(1);
                            expect(res.body.comment.votes).to.equal(0);
                        });
                });
                it('POST returns status code 404 and informative message when passed an incomplete request', () => {
                    return request(app)
                        .post('/api/articles/1/comments')
                        .send({ body: 'text' })
                        .expect(404)
                        .then(res => {
                            expect(res.body).to.eql({ msg: 'missing information!' })
                        });
                });
                it('POST returns 400 and informative message when an invalid article_id is queried', () => {
                    return request(app)
                        .post('/api/articles/not-a-valid-id/comments')
                        .send({ username: 'lurker', body: 'text' })
                        .expect(400)
                        .then(res => {
                            expect(res.body).to.eql({ msg: 'invalid data type!' })
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
                it('GET returns 200 and an object with the key of comments and value of an array of comments as objects containing all properties in order of the query', () => {
                    return request(app)
                        .get('/api/articles/1/comments?order=asc')
                        .expect(200)
                        .then(res => {
                            expect(res.body.comments).to.be.an('array');
                            expect(res.body.comments).to.be.sortedBy('created_at', { ascending: true });
                            //test for all keys
                        });
                });
                it('GET returns status code 404 and informative message when a valid but non-existent id is requested', () => {
                    return request(app)
                        .get('/api/articles/1000/comments')
                        .expect(404)
                        .then(res => {
                            expect(res.body).to.eql({ msg: 'id does not exist!' });
                        });
                });
                it('GET returns status code 400 when invalid is requested', () => {
                    return request(app)
                        .get('/api/articles/not-a-valid-id/comments')
                        .expect(400)
                        .then(res => {
                            expect(res.body).to.eql({ msg: 'invalid data type!' });
                        });
                });
                it('GET returns status code and informative message when query for sort_by with a non-existing column is requested', () => {
                    return request(app)
                        .get('/api/articles/1/comments?sort_by=not-existent-column')
                        .expect(400)
                        .then(res => {
                            expect(res.body).to.eql({ msg: 'column does not exist!' });
                        });
                });
                it('PUT returns status code 405 and informative message', () => {
                    return request(app)
                        .put('/api/articles/1/comments')
                        .expect(405)
                        .then(res => {
                            expect(res.body).to.eql({ msg: 'method not allowed' });
                        });
                });
            });
        });
    });
    describe('/comments', () => {
        describe('/:comment_id', () => {
            it('PATCH returns status code 200 and n object with the key of comments and value of an array containing a comment as an object that has all properties when passed an object with a property value of a number that the comments vote should be adjusted by', () => {
                return request(app)
                    .patch('/api/comments/1')
                    .send({ inc_votes: -1 })
                    .expect(200)
                    .then(res => {
                        expect(res.body.comment).to.be.an('object');
                        expect(res.body.comment).to.contain.keys('comment_id', 'author', 'article_id', 'votes', 'created_at', 'body');
                        expect(res.body.comment.votes).to.equal(15);
                    });
            });
            it('DELETE returns status code 204 and no content', () => {
                return request(app)
                    .delete('/api/comments/1')
                    .expect(204)
            });
            it('PUT returns status code 405 and message', () => {
                return request(app)
                    .put('/api/comments/1')
                    .expect(405)
                    .then(res => {
                        expect(res.body).to.eql({ msg: 'method not allowed' });
                    });
            });
            it.only('PATCH returns status code 400 and informative message when a patch request object with an invalid value is passed in', () => {
                return request(app)
                    .patch('/api/comments/1')
                    .send({ inc_votes: 'not-a-valid-value' })
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.eql({ msg: 'invalid data type!' });
                    });
            });
        });
    });
});
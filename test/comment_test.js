const chai = require('chai');
const chaiHttp = require('chai-http');
const index = require('../index');
const moment = require('moment');
const mongoose = require('mongoose');
const Thread = require('../src/schemas/ThreadSchema');
const Comment = require('../src/schemas/CommentSchema');

chai.should();
chai.use(chaiHttp);

const datetime = moment().unix().toString();

describe('Comment', () => {
    let token = '';
    before((done) => {
        chai.request(index)
            .post('/api/register')
            .set('Content-Type', 'application/json')
            .send({
                username: "TEST",
                email: "test@test.com",
                password: "TEST!123"
            })
            .end((err, res) => {
                if (err) console.log("Error: " + err);
                if (res) {
                    console.log("The test user has been created");
                    token = res.body.token;
                }
                done();
            });
    });

    it('Should create a comment', (done) => {
        chai.request(index)
            .post('/api/thread')
            .set('Content-Type', 'application/json')
            .set('X-Access-Token', token)
            .send({
                title: "Chai test for thread",
                content: "The content of the chai test thread"
            })
            .end((err, res) => {
                if (err) {
                    console.log("Create thread with valid properies error ==== " + err);
                }

                Thread.findOne({ title: "Chai test for thread" })
                    .then((thread) => {
                        chai.request(index)
                            .post('/api/comment/' + thread._id)
                            .set('Content-Type', 'application/json')
                            .set('X-Access-Token', token)
                            .send({
                                content: "This is the content of a test comment"
                            })
                            .end((error, result) => {
                                if (error) {
                                    console.log("Create comment error ====" + error);
                                }
                                result.should.have.status(200);
                                result.body.should.have.property('message', 'comment created and saved to the thread and user');

                                res.should.have.status(201);
                                res.body.should.have.property('message', 'Thread created and save to the user');

                                done();
                            })
                    })


            })
    });

    it('should delete a comment', (done) => {
        chai.request(index)
            .post('/api/thread')
            .set('Content-Type', 'application/json')
            .set('X-Access-Token', token)
            .send({
                title: "Chai test for thread",
                content: "The content of the chai test thread"
            })
            .end((err, res) => {
                if (err) {
                    console.log("Create thread with valid properies error ==== " + err);
                }

                Thread.findOne({ title: "Chai test for thread" })
                    .then((thread) => {
                        chai.request(index)
                            .post('/api/comment/' + thread._id)
                            .set('Content-Type', 'application/json')
                            .set('X-Access-Token', token)
                            .send({
                                content: "This is the content of a test comment"
                            })
                            .end((error, result) => {
                                if (error) {
                                    console.log("Create comment error ====" + error);
                                }

                                Comment.findOne({ content: "This is the content of a test comment" })
                                    .then((comment) => {
                                        chai.request(index)
                                            .delete('/api/comment/' + thread._id + '/' + comment._id)
                                            .set('Content-Type', 'application/json')
                                            .set('X-Access-Token', token)
                                            .end((error, result) => {
                                                if (error) {
                                                    console.log("Create comment error ====" + error);
                                                }
                                                result.should.have.status(200);
                                                result.body.should.have.property('message', 'comment has been deleted');

                                                res.should.have.status(201);
                                                res.body.should.have.property('message', 'Thread created and save to the user');

                                                done();
                                            })
                                    });
                            })
                    })
            })
    });

    after((done) => {
        mongoose.connection.collections.threads.drop(() => {
            chai.request(index)
                .delete('/api/user')
                .set('X-Access-Token', token)
                .end((err, res) => {
                    if (err) console.log("Error: " + err);
                    if (res) {
                        console.log("The test user has been deleted");
                        token = res.body.token;
                    }
                    done();
                });
        })
    })
})
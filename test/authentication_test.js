const chai = require('chai');
const chaiHttp = require('chai-http');
const index = require('../index');
const moment = require('moment');
const mongoose = require('mongoose');

chai.should();
chai.use(chaiHttp);

const datetime = moment().unix().toString();

describe('Registration', () => {
    it('should return an error on GET request', (done) => {
        chai.request(index)
            .get('/api/register')
            .end((err, res) => {
                res.should.have.status(404);
                done()
            });
    });

    it('should throw an error when username is shorter than 2 chars', (done) => {
        chai.request(index)
            .post('/api/register')
            .send({
                username: "X",
                lastname: datetime,
                password: `T3st-${datetime}`
            })
            .end((err, res) => {
                res.should.not.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('datetime');
                done()
            });
    });

    it('should throw an error when no username is provided', (done) => {
        chai.request(index)
            .post('/api/register')
            .send({
                username: "Test",
                password: `T3st-${datetime}`
            })
            .end((err, res) => {
                res.should.not.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('datetime');
                done()
            });
    });

    it('should throw an error when username is shorter than 2 chars', (done) => {
        chai.request(index)
            .post('/api/register')
            .send({
                username: "Test",
                lastname: "X",
                password: `T3st-${datetime}`
            })
            .end((err, res) => {
                res.should.not.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('datetime');
                done()
            });
    });
});


describe('Login', () => {
    let token = '';

    before((done) => {
        chai.request(index)
            .post('/api/register')
            .set('Content-Type', 'application/json')
            .send({
                username: "TEST",
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

    it('should return a token when providing valid information', (done) => {
        chai.request(index)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({
            username: "TEST",
            password: "TEST!123"
        })
        .end((err, res) => {
            if (err) console.log("Error: " + err);
            if (res) {
                console.log("The test user has been created");
                token = res.body.token;

                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
            }
            done();
        });
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
});
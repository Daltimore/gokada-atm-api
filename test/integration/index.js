const app = require('../../index');

const assert = require('assert');
const request = require('supertest');

describe('Integration test', () => {
    it('Test Default route', done => {
        request(app)
            .get('/')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((res) => {
                assert.equal(res.body.message, 'ATM Service');
                done();
            });
    });


    it('Test Start Session Route and Fail', done => {
        request(app)
            .post('/')
            .set('Content-Type', 'application/json')
            .send({
                card_number: '123456789123456',
                pin: '12345'
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end((res) => {
                assert.equal(res.body.message, 'Invalid PIN. Please try again');
                done();
            });
    });


    it('Test Get Balance and fail', done => {
        request(app)
            .get('/balance')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((res) => {
                assert.equal(res.body.message, 'Unauthenticated Request');
                done();
            });
    });


    it('Test make withdrawal and fail', done => {
        request(app)
            .post('/withdrawal')
            .set('Content-Type', 'application/json')
            .send({
                amount: 15000,
                notes: 500
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end((res) => {
                assert.equal(res.body.message, 'Unauthenticated Request');
                done();
            });
    });


    it('Test Start Session Route Successfully', done => {
        request(app)
            .post('/')
            .set('Content-Type', 'application/json')
            .send({
                card_number: '123456789123456',
                pin: '1234'
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end((res) => {
                assert.equal(res.body.data.message, 'Session Started');
                assert.equal(res.body.data.session_data.account_name, 'Gokada Name');
                done();
            });
    });
});

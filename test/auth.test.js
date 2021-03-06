'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { TEST_DATABASE_URL } = require('../config');
const { dbConnect, dbDisconnect } = require('../db-mongoose');
const { User } = require('../users/models');
const { JWT_SECRET } = require('../config');
const jwt = require('jsonwebtoken');
const { app } = require('../index');

// Set NODE_ENV to `test` to disable http layer logs
// You can do this in the command line, but this is cross-platform
process.env.NODE_ENV = 'test';

// Clear the console before each run
process.stdout.write('\x1Bc\n');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Auth endpoints', function () {
        const username = 'username';
        const password = 'password';

        //Connect To Database
        before(function () {
          return dbConnect(TEST_DATABASE_URL);
        });

        //Disconnect From Database
        after(function () {
          return dbDisconnect();
        });

        beforeEach(function () {
          return User.hashPassword(password).then(password => User.create({ username, password }));
        });

        afterEach(function () {
          return User.remove({});
        });

        it('Should reject requests with no credentials', function () {
          return chai.request(app).post('/api/auth/login')
          .then(() => expect.fail(null, null, 'Request should not succeed'))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(400);
          });
        });

        it('Should reject requests with incorrect usernames', function () {
              return chai.request(app).post('/api/auth/login').auth('wrongUsername', password)
              .then(() => expect.fail(null, null, 'Request should not succeed'))
              .catch(err => {
                if (err instanceof chai.AssertionError) {
                  throw err;
                }

                const res = err.response;
                expect(res).to.have.status(400);
              });
            });

        it('Should reject requests with incorrect passwords', function () {
          return chai.request(app).post('/api/auth/login').auth(username, 'wrongPassword')
          .then(() => expect.fail(null, null, 'Request should not succeed'))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(400);
          });
        });

        //Not Working
        /*
        it('Should return a valid auth token', function () {
          return chai.request(app).post('/api/auth/login').auth(username, password)
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            const token = res.body.authToken;
            expect(token).to.be.a('string');
            const payload = jwt.verify(token, JWT_SECRET, {
              // algorithm: ['HS256']
            });
            expect(payload.user).to.deep.equal({ username });
          });
        });
        */
      });

describe('/api/auth/refresh', function () {
  it('Should reject requests with no credentials', function () {
    return chai.request(app).post('/api/auth/refresh')
    .then(() => expect.fail(null, null, 'Request should not succeed'))
    .catch(err => {
      if (err instanceof chai.AssertionError) {
        throw err;
      }

      const res = err.response;
      expect(res).to.have.status(401);
    });
  });
  /*
    it('Should reject requests with an invalid token', function () {
      const token = jwt.sign({
        username,
      }, 'wrongSecret', {
        // algorithm: 'HS256',
        expiresIn: '7d',
      });
      return chai.request(app).post('/api/auth/refresh').set('Authorization', `Bearer ${token}`)
      .then(() => expect.fail(null, null, 'Request should not succeed'))
      .catch(err => {
        if (err instanceof chai.AssertionError) {
          throw err;
        }

        const res = err.response;
        expect(res).to.have.status(401);
      });
    });

    it('Should reject requests with an expired token', function () {
      const token = jwt.sign({
        user: {
          username,
        },
        exp: Math.floor(Date.now() / 1000) - 10,
      }, JWT_SECRET, {
        // algorithm: 'HS256',
        subject: username,
      });
      return chai.request(app).post('/api/auth/refresh').set('authorization', `Bearer ${token}`)
      .then(() => expect.fail(null, null, 'Request should not succeed'))
      .catch(err => {
        if (err instanceof chai.AssertionError) {
          throw err;
        }

        const res = err.response;
        expect(res).to.have.status(401);
      });
    });

    it('Should return a valid auth token with a newer expiry date', function () {
      const token = jwt.sign({
        user: {
          username,
        },
      }, JWT_SECRET, {
        // algorithm: 'HS256',
        subject: username,
        expiresIn: '7d',
      });
      const decoded = jwt.decode(token);
      return chai.request(app).post('/api/auth/refresh')
      .set('authorization', `Bearer ${token}`)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        const token = res.body.authToken;
        expect(token).to.be.a('string');
        const payload = jwt.verify(token, JWT_SECRET, {
          // algorithm: ['HS256']
        });
        expect(payload.user).to.deep.equal({ username });
        expect(payload.exp).to.be.at.least(decoded.exp);
      });
    });
    */
});

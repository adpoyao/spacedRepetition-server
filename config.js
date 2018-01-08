'use strict';

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: 'https://kurikaeshi.netlify.com',
  // process.env.CLIENT_ORIGIN || 'http://localhost:3000' || ,
  DATABASE_URL: 'mongodb://dev:dev@ds247587.mlab.com:47587/kurikaeshi',
      // process.env.DATABASE_URL || 'mongodb://localhost/thinkful-backend',
  TEST_DATABASE_URL:
      process.env.TEST_DATABASE_URL ||
      'mongodb://localhost/thinkful-backend-test',

  // DATABASE_URL:
  //     process.env.DATABASE_URL || 'postgres://localhost/thinkful-backend',
  // TEST_DATABASE_URL:
  //     process.env.TEST_DATABASE_URL ||
  //     'postgres://localhost/thinkful-backend-test'
};

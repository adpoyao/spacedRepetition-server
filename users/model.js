'use strict';

const bcrypt = require('bcryptjs');

function hashPassword(password) {
  return bcrypt.hash(password);
}

function validatePassword(password, hashpass) {
  return bcrypt.compare(password, hashpass);
}

module.exports = {
  hashPassword,
  validatePassword,
};

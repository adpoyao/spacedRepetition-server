const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();

const {User} = require('./models');
const {Question} = require('../questions/models');
const LinkedList = require('./linked-list');
//import the Questions from the questions model and router

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({code: 422, reason: 'Validation Error', message: 'Missing field', location: missingField});
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 6,
      max: 72
    }
  };

  const tooSmallField = Object.keys(sizedFields).find(field => 'min' in sizedFields[field] && req.body[field].trim().length < sizedFields[field].min);

  const tooLargeField = Object.keys(sizedFields).find(field => 'max' in sizedFields[field] && req.body[field].trim().length > sizedFields[field].max);

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'Validation Error',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField].min} chars long`
        : `Must be at most ${sizedFields[tooLargeField].max} chars long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password} = req.body;

  return User.find({username}).count().then(count => {
    if (count > 0) {
      return Promise.reject({code: 422, reason: 'Validation Error', message: 'Username already taken', location: 'username'});
    }

    return User.hashPassword(password);
  }).then(hash => {
    return User.create({username, password: hash});
  }).then(user => Question.find().then(questions => ({user, questions}))).then(({user, questions}) => {
    let linked = new LinkedList();
    questions.map((each, index) => linked.insert(index, each));
    user.questions = linked;
    return res.status(201).json(user.serialize());
  }).catch(err => {
    if (err.reason == 'Validation Error') {
      return res.status(err.code).json(err);
    }

    res.status(500).json({code: 500, message: 'Internal server error'});
  });
});

router.put('/:username/:questions', jsonParser, (req, res) => {
  const requiredFields = ['username', 'questions'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  if (req.params.username !== req.body.username) {
    const message = `Request path username (${req.params.username}) and request body username (${req.body.username}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }

  if (req.params.questions !== req.body.questions) {
    const message = `Request path questions (${req.params.questions}) and request body questions (${req.body.questions}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }

  console.log(`Updating \`${req.params.username}\`'s questions in database with \`${req.params.questions}\``);
  LinkedList.update({username: req.body.username, questions: req.body.questions});
  return res.status(204).json(Question.serialize());
  return res.status(204).json(User.serialize()).end();

  const toUpdate = {};
  const updateableFields = ['username', 'questions'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  questions.findByIdAndUpdate(req.params.username, { $set: toUpdate }).then(questions => res.status(204).json(questions.serialize).end()).catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = router;

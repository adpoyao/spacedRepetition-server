const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const { retrieve, remove, insert } = require('../linkedList/linkedList');
const { User } = require('./models');
const { Question } = require('../questions/models');
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
	}).then(user => Question.find().then(questions => ({user, questions})))
		.then(({user, questions}) => {
			let linked = new LinkedList();
			questions.map((each, index) => linked.insert(index, each));
			user.questions = linked;
			return user.save();
		}).then(user => {return res.status(201).json(user.serialize());
		}).catch(err => {
			if (err.reason == 'Validation Error') {
				return res.status(err.code).json(err);
			}
			res.status(500).json({code: 500, message: 'Internal server error'});
		});
});

router.post('/answer', jsonParser, (req, res) => {
	let response = req.body.boolean;

	User.findOne({username: req.body.username})
		.then(user => {
			let questions = user.questions;
			let current = retrieve(questions, 0);
			remove(questions, 0);

			current.total += 1;

			if (response) {
				current.right += 1;
			}

			if (response) {
				current.strength *= 2;
				if (current.strength <= questions.length) {
					insert(questions, current.strength, current);
				}
				else {
					insert(questions, questions.length, current);
				}
			} else {
				current.strength = 1;
				insert(questions, current.strength + 1, current);
			}

			user.questions = questions;
			return User.findByIdAndUpdate(user._id, {questions}, {new: true});
		})
		.then(user => {
			return res.status(201).json(user.questions.head.value);
		});
});

module.exports = router;

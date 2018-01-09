const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();

const { User } = require('./models');

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
	}).then(user => {
		return res.status(201).json(user.serialize());
	}).catch(err => {
		if (err.reason == 'Validation Error') {
			return res.status(err.code).json(err);
		}
		res.status(500).json({code: 500, message: 'Internal server error'});
	});
});

module.exports = router;

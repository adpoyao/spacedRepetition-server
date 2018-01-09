const express = require('express');
const router = express.Router();

const {Question} = require('./models');

//Get all
router.get('/', (req, res) => {
	Question
		.find()
		.then(questions => {
			res.json({
				questions: questions.map(
					question => question.serialize()
				)
			});
		})
		.catch(
			err => {
				console.log(err);
				res.status(500).json({message: 'Internal server error'});
			}
		);
});

//Get one
router.get('/:id', (req, res) => {
	Question
		.findById(req.params.id)
		.then(question => res.json(question.serialize()))
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Internal server error'});
		});
});

//Create a new question
router.post('/', (req, res) => {
	const requiredFields = ['vocab', 'hiragana', 'katakana', 'romaji', 'example', 'correct'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
    
	Question
		.create({
			vocab: req.body.vocab,
			hiragana: req.body.hiragana,
			katakana: req.body.katakana,
			romaji: req.body.romaji,
			example: req.body.example,
			correct: req.body.correct
		})
		.then(
			question => question.status(201).json(question.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'});
		});
});

//Modify existing questions
router.put('/:id', (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		const message = (
			`Request path id (${req.params.id}) and request body id ` +
            `(${req.body.id}) must match`);
		console.error(message);
		return res.status(400).json({message: message});
	}
    
	const toUpdate = {};
	const updateableFields = ['vocab', 'hiragana', 'katakana', 'romaji', 'example', 'correct'];

	updateableFields.forEach(field => {
		if (field in req.body) {
			toUpdate[field] = req.body[field];
		}
	});

	Question
		.findByIdAndUpdate(req.params.id, {$set: toUpdate})
		.then(question => res.status(204).end())
		.catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.delete('/:id', (req, res) => {
	Question
		.findByIdAndRemove(req.params.id)
		.then(() => res.status(204).end())
		.catch(err => res.status(500).json({message: 'Internal server error'}));
});
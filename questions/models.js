const mongoose = require('mongoose');

const QuestionSchema = mongoose.Schema({
	vocab: {type: String, required: true},
	hiragana: {type: String, required: true},
	katakana: {type: String, required: true},
	romaji: {type: String, required: true},
	example: {type: String, required: true},
	correct: {type: String, required: true},
	strength: {type: Number, required: true, default: 1}
});

QuestionSchema.methods.serialize = function () {
	return {
		vocab: this.vocab || '',
		hiragana: this.hiragana || '',
		katakana: this.katakana || '',
		romaji: this.romaji || '',
		example: this.example || '',
		correct: this.correct || '',
		strength: this.strength || ''
	};
};

const Question = mongoose.model('Question', QuestionSchema);

module.exports = {Question};
const Cat = require('./../models/catModel.js');
const Bowl = require('./../models/bowlModel.js');

exports.handleGetAllCats = () => async (req,res) => {
	const cats = await Cat.find();
	res.send(cats);
};

exports.handleGetAllBowls = () => async (req,res) => {
	const bowls = await Bowl.find();
	res.send(bowls);
};
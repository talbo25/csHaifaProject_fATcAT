const handleTinCan = (database) => (req,res) => {

	if (!("Major_Tom" in req.body)) {

		return res.status(400).json("-E- WHO ARE YOU?");
	}
	const { Major_Tom } = req.body;

	let bowlHours = "";
	let catsWeights = [];
	let catsHours = [];
	let found = false;
	let method = "";

	database["bowls"].forEach((bowl) => {
		if (bowl["id"] === Major_Tom["id"] && bowl["key"] === Major_Tom["key"]){
			bowlHours = bowl["activeHours"];
			method = bowl["method"];
			found = true;
		}
	})
	database["cats"].forEach((cat) => {
		if (cat["bowlID"] === Major_Tom["id"]) {
			catsWeights.push(cat["weight"]);
			catsHours.push(cat["feedingHours"]);
		}
	})

	res.json(
	{
		"bowlHours" : bowlHours,
		"catsWeights": catsWeights,
		"catsHours": catsHours,
		"method": method,
	})
	if (!found) {
		return res.status(400).json("-E- Couldn't find bowl");
	}
}

module.exports = {
	handleTinCan : handleTinCan,
};
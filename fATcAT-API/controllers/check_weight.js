const handleCheckWeight = (database) => (req,res) => {
	const BreakException= {};
	let found = false;
	const { weight, bowlID } = req.body;
	let message = "No Bowl with ID "+ bowlID;
	try {
			database.bowls.forEach((bowl) => {
			if (bowl["id"] === bowlID) {
				message = "No cats for bowl";
				database.cats.forEach((cat) => {
					if ( bowl["cats"].includes(cat["id"])) {
						//check if cat fit to the conditions
						console.log("111DADADA ",cat["id"]);
						const minW =cat["weight"]-0.2;
						const maxW = parseFloat(cat["weight"])+0.2;
						if (weight >= minW && weight <= maxW) {
							// cat fit to weight check
							if (cat["feedingHours"] === "00:00") {
								//can eat anytime
								found = true;
								throw BreakException;
							}
							const m = cat["feedingHours"].match(/^s?(\d\d):\d\d?e?(\d\d):\d\d?$/);
							if (m) {
								const date_ob = new Date();
								const hours = date_ob.getHours();
								if (m[1] < m[3]) {
									//regular range min-max
									found = hours >= m[1] && hours < m[3]; 
								} else {
									//over the 00:00 point
									found = hours >= m[1] || hours < m[3];
								}
								if (!found) {
									message = "Failed because hour";
								}
								throw BreakException;
							} 
						} else {
							message = "Failed because weight ";
						}
					}
				})
			}
		})
	} catch (e) {
		if (e !== BreakException) throw e;
	}
	if (!found){
		return res.status(400).json(message);
	}
	res.json(found);
}

module.exports = {
	handleCheckWeight : handleCheckWeight,
};
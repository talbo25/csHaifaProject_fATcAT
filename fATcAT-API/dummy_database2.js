const database = {
	bowls: [
	{
		"id": "001",
		"key": "AAA",
		"activeHours": "s02:00e20:00",
	},
	{
		"id": "002",
		"key": "BBB",
		"activeHours": "s08:00e19:00",
	},
	{
		"id": "003",
		"key": "AAB",
		"activeHours": "s01:00e02:00",
	},
	{
		"id": "004",
		"key": "ABB",
		"activeHours": "s01:00e13:00",
	},
	],
	 devices : [
		{
			"id": "44614646f2e8ebc",
			"bowls": [
				{
					"id" : "001",
					"name" : "living room",
				},
				{
					"id" : "002",
					"name" : "kitchen",
				}
			],
		},
	],
	cats: [
	  {
	    id: "0",
	    sex: "female",
	    name: "saga",
	    weight: "2.33",
	    bowlID: "001",
	    feedingHours: "s08:00e21:00",
	  },
	  {
	    id: "1",
	    sex: "male",
	    name: "soren",
	    weight: "3.14",
	    bowlID: "002",
	    feedingHours: "s10:00e20:00",
	  },
	  {
	    id: "2",
	    sex: "male",
	    name: "garfield",
	    weight: "4.20",
	    bowlID: "001",
	    feedingHours: "s05:00e16:00",
	  },
	  {
	    id: "3",
	    sex: "male",
	    name: "Schrödinger",
	    weight: "3.65",
	    bowlID: "001",
	    feedingHours: "s20:00e02:30",
	  },
	  {
	    id: "4",
	    sex: "female",
	    name: "Mishmish",
	    weight: "5.3",
	    bowlID: "004",
	    feedingHours: "s20:00e02:30",
	  },
	],

}

module.exports = database;
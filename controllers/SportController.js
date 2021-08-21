var db  = require('../models');
var Sport = db.sport;

var SportController = {};

SportController.list = function(req, res) {
	Sport.find().then(function ( sports) {

		if (sports) {
			res.render("../views/sport/sport.ejs", {sports: sports});
		}
	});
};

module.exports = SportController;
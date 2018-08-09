module.exports = function(){

	var express = require('express');
	var router = express.Router();

	// Characters Functions
	function getCharacters(res, mysql, context, complete){
	mysql.pool.query('SELECT hp_characters.id AS characterId, hp_characters.fname, hp_characters.lname, hp_schools.id AS schoolId, hp_schools.name AS schoolName, hp_houses.name AS houseName FROM hp_characters INNER JOIN hp_schools ON schoolId = hp_schools.id INNER JOIN hp_houses ON houseId = hp_houses.id', function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.end();
			}
			context.characters = results;
			complete();
		});
	}


	// Characters Routes
	router.get('/', function(req, res){
		var context = {};
		callbackCount = 0;
		var mysql = req.app.get('mysql');
		getCharacters(res, mysql, context, complete);

		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				res.render('characters', context);
			}
		}
	});



	return router;
}();
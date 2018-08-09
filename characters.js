module.exports = function(){

	var express = require('express');
	var router = express.Router();

	// Characters Functions
	function getCharacters(res, mysql, context, complete){
	mysql.pool.query('SELECT hp_characters.id AS characterId, hp_characters.fname, hp_characters.lname, hp_schools.id AS schoolId, hp_schools.name AS schoolName, hp_houses.id AS houseId, hp_houses.name AS houseName FROM hp_characters INNER JOIN hp_schools ON schoolId = hp_schools.id INNER JOIN hp_houses ON houseId = hp_houses.id', function(err, results, fields){
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

    router.post('/', function(req, res){
        //console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO hp_characters (fname, lname, houseId, schoolId) VALUES (?,?,?,?)";
        var inserts = [req.body.fname, req.body.lname, req.body.houseId, req.body.schoolId];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/characters');
            }
        });
    });

	return router;
}();
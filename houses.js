module.exports = function(){

	var express = require('express');
	var router = express.Router();

	// Houses Functions
	function getSchools(res, mysql, context, complete){
		mysql.pool.query('SELECT hp_schools.id AS schoolId, hp_schools.name AS schoolName, hp_schools.population AS schoolPopulation, hp_schools.location AS schoolLocation FROM hp_schools', function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.end();
			}
			context.schools = results;
			complete();
		});
	}

	function getHouses(res, mysql, context, complete){
		mysql.pool.query('SELECT hp_houses.id AS houseId, hp_houses.name AS houseName, hp_houses.schoolId AS schoolId, hp_schools.name AS schoolName FROM hp_houses INNER JOIN hp_schools ON hp_houses.schoolId = hp_schools.id', function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.end();
			}
			context.houses = results;
			complete();
		});
	}


	// Houses Routes
	router.get('/', function(req, res){
		var context = {};
		callbackCount = 0;
		var mysql = req.app.get('mysql');
		getSchools(res, mysql, context, complete);
		getHouses(res, mysql, context, complete);

		function complete(){
			callbackCount++;
			if(callbackCount >= 2){
				res.render('houses', context);
			}
		}
	});

  // Add House
  router.post('/', function(req, res){
      //console.log(req.body)
      var mysql = req.app.get('mysql');
      var sql = "INSERT INTO hp_houses (name, schoolId) VALUES (?,?)";
      var inserts = [req.body.name, req.body.schoolId];
      sql = mysql.pool.query(sql,inserts,function(error, results, fields){
          if(error){
              console.log(JSON.stringify(error))
              res.write(JSON.stringify(error));
              res.end();
          }else{
              res.redirect('/houses');
          }
      });
  });    

	return router;
}();
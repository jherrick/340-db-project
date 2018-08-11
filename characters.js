module.exports = function(){

	var express = require('express');
	var router = express.Router();

	// Characters Functions
	function getCharacters(res, mysql, context, complete){
	mysql.pool.query('SELECT hp_characters.id AS characterId, hp_characters.fname, hp_characters.lname, hp_schools.id AS schoolId, hp_schools.name AS schoolName, hp_houses.id AS houseId, hp_houses.name AS houseName FROM hp_characters INNER JOIN hp_schools ON schoolId = hp_schools.id INNER JOIN hp_houses ON houseId = hp_houses.id GROUP BY characterId', function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.end();
			}
			context.characters = results;
			complete();
		});
	}

    function getPerson(res, mysql, context, id, complete){
      var sql = "SELECT id, fname, lname, houseId, schoolId FROM hp_characters WHERE id = ?";
      var inserts = [id];
      mysql.pool.query(sql, inserts, function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }
          context.person = results[0];
          complete();
      });
  }

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
		mysql.pool.query('SELECT hp_houses.id AS houseId, hp_houses.name AS houseName FROM hp_houses', function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.end();
			}
			context.houses = results;
			complete();
		});
	}


	// Characters Routes
	// Main Characters page
	router.get('/', function(req, res){
		var context = {};
		context.jsscripts = ["deleteChar.js"];
		callbackCount = 0;
		var mysql = req.app.get('mysql');
		getCharacters(res, mysql, context, complete);
		getSchools(res, mysql, context, complete);
		getHouses(res, mysql, context, complete);

		function complete(){
			callbackCount++;
			if(callbackCount >= 3){
				res.render('characters', context);
			}
		}
	});

	// Insert a Character
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

  // Display one character to be updated
  router.get('/:id', function(req, res){
      callbackCount = 0;
      var context = {};
      context.jsscripts = ["selectedplanet.js", "updateperson.js"];
      var mysql = req.app.get('mysql');
      getPerson(res, mysql, context, req.params.id, complete);
      getSchools(res, mysql, context, complete);
      getHouses(res, mysql, context, complete);
      function complete(){
          callbackCount++;
          if(callbackCount >= 3){
              res.render('update-person', context);
          }
      }
  });

  // Update a Character
  router.put('/:id', function(req, res){
    var mysql = req.app.get('mysql');
    // console.log(req.body)
    // console.log(req.params.id)
    var sql = "UPDATE hp_characters SET fname=?, lname=?, schoolId=?, houseId=? WHERE id=?";
    var inserts = [req.body.fname, req.body.lname, req.body.school, req.body.house, req.params.id];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            console.log(error)
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.status(200);
            res.end();
        }
    });
});

  	//delete a character
	router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM hp_characters WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })


	return router;
}();
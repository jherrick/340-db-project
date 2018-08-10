module.exports = function(){

	var express = require('express');
	var router = express.Router();

	// Spells Functions
	function getSpells(res, mysql, context, complete){
		mysql.pool.query('SELECT hp_spells.id AS spellId, hp_spells.name AS spellName, hp_spells.type AS spellType FROM hp_spells', function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.end();
			}
			context.spells = results;
			complete();
		});
	}


	// Spells Routes
	router.get('/', function(req, res){
		var context = {};
		callbackCount = 0;
		var mysql = req.app.get('mysql');
		getSpells(res, mysql, context, complete);

		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				res.render('spells', context);
			}
		}
	});

  // Add Spell
  router.post('/', function(req, res){
      //console.log(req.body)
      var mysql = req.app.get('mysql');
      var sql = "INSERT INTO hp_spells (name, type) VALUES (?,?)";
      var inserts = [req.body.name, req.body.type];
      sql = mysql.pool.query(sql,inserts,function(error, results, fields){
          if(error){
              console.log(JSON.stringify(error))
              res.write(JSON.stringify(error));
              res.end();
          }else{
              res.redirect('/spells');
          }
      });
  });   



	return router;
}();
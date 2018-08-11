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

	function getCharacters(res, mysql, context, complete){
	mysql.pool.query('SELECT hp_characters.id AS characterId, hp_characters.fname, hp_characters.lname FROM hp_characters GROUP BY characterId', function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.end();
			}
			context.characters = results;
			complete();
		});
	}

	function getCharSpells(res, mysql, context, complete){
	mysql.pool.query('SELECT hsc.cid AS cid, hsc.pid AS pid, hc.fname AS fname, hc.lname AS lname, hs.name AS spell FROM hp_spells_chars hsc INNER JOIN hp_characters hc ON hsc.cid = hc.id INNER JOIN hp_spells hs ON hsc.pid = hs.id', function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.end();
			}
			context.charspell = results;
			complete();
		});
	}


	// Spells Routes
	router.get('/', function(req, res){
		var context = {};
		context.jsscripts = ["deleteChar.js"];
		callbackCount = 0;
		var mysql = req.app.get('mysql');
		getSpells(res, mysql, context, complete);
		getCharacters(res, mysql, context, complete);
		getCharSpells(res, mysql, context, complete);

		function complete(){
			callbackCount++;
			if(callbackCount >= 3){
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

  // Add char / spell association
  router.post('/charspells', function(req, res){
      var mysql = req.app.get('mysql');
      var sql = "INSERT INTO hp_spells_chars (cid, pid) VALUES (?,?)";
      var inserts = [req.body.characterId, req.body.spellId];
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

  //delete char spell association
    router.delete('/pid/:pid/cid/:cid', function(req, res){
        //console.log(req) //I used this to figure out where did pid and cid go in the request
        console.log(req.params.pid)
        console.log(req.params.cid)
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM hp_spells_chars WHERE pid = ? AND cid = ?";
        var inserts = [req.params.pid, req.params.cid];
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
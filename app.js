// Daniel Bauman
// CS340 Project

var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var mysql = require('./dbcon.js');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('mysql', mysql);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.use('/', express.static('public'));
app.set('port', 8013);

function getCharacters(res, mysql, context, complete){
	mysql.pool.query('SELECT hp_characters.id AS characterId, hp_characters.fname, hp_characters.lname, hp_schools.id AS schoolId, hp_schools.name AS schoolName, hp_houses.name AS houseName FROM hp_characters INNER JOIN hp_schools ON schoolId = hp_schools.id INNER JOIN hp_houses ON houseId = hp_houses.id', function(err, results, fields){
		if(err){
			res.write(JSON.stringify(err));
			res.end();
		}
		// console.log("This is the getCharacters function.");
		context.characters = results;
		complete();
	});
}

function getSchools(res, mysql, context, complete){
	mysql.pool.query('SELECT hp_schools.id AS schoolId, hp_schools.name AS schoolName, hp_schools.population AS schoolPopulation, hp_schools.location AS schoolLocation FROM hp_schools', function(err, results, fields){
		if(err){
			res.write(JSON.stringify(err));
			res.end();
		}
		// console.log("This is the getSchools function.");
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
		// console.log("This is the getHouses function.");
		context.houses = results;
		complete();
	});
}

function getSpells(res, mysql, context, complete){
	mysql.pool.query('SELECT hp_spells.id AS spellId, hp_spells.name AS spellName, hp_spells.type AS spellType FROM hp_spells', function(err, results, fields){
		if(err){
			res.write(JSON.stringify(err));
			res.end();
		}
		// console.log("This is the getSpells function.");
		context.spells = results;
		complete();
	});
}


// HOME ROUTE
// Renders the home page
app.get('/', function(req, res){
	var context = {};
	callbackCount = 0;
	var mysql = req.app.get('mysql');
	getCharacters(res, mysql, context, complete);

	function complete(){
		callbackCount++;
		if(callbackCount >= 1){
			// console.log(context);
			res.render('home', context);
		}
	}
});

app.get('/schools', function(req, res){
	var context = {};
	callbackCount = 0;
	var mysql = req.app.get('mysql');
	getSchools(res, mysql, context, complete);
	getHouses(res, mysql, context, complete);

	function complete(){
		callbackCount++;
		if(callbackCount >= 2){
			// console.log(context);
			res.render('schools', context);
		}
	}
});

app.get('/spells', function(req, res){
	var context = {};
	callbackCount = 0;
	var mysql = req.app.get('mysql');
	getSpells(res, mysql, context, complete);

	function complete(){
		callbackCount++;
		if(callbackCount >= 1){
			// console.log(context);
			res.render('spells', context);
		}
	}
});

// ERROR ROUTES
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});


// Server listen config
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
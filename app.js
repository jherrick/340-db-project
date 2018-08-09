// Daniel Bauman & Joel Herrick
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
app.set('port', process.argv[2]);

// Routes & functions files
app.use('/characters', require('./characters.js'));
app.use('/schools', require('./schools.js'));
app.use('/spells', require('./spells.js'));




// Home Route
app.get('/', function(req, res){
	res.render('home');
});




// Error Routes
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
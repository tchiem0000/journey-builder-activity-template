'use strict';
// Module Dependencies
// -------------------
var express     = require('express');
var bodyParser  = require('body-parser');
var errorhandler = require('errorhandler');
var http        = require('http');  //web service
var path        = require('path');
var request     = require('request');
var routes      = require('./routes');
var activity    = require('./routes/activity');

var app = express();

// Configure Express
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.raw({type: 'application/jwt'}));
//app.use(bodyParser.urlencoded({ extended: true }));

//app.use(express.methodOverride());
//app.use(express.favicon());

app.use(express.static(path.join(__dirname, 'public')));

// Express in Development Mode
if ('development' == app.get('env')) {
  app.use(errorhandler());
}

// HubExchange Routes
app.get('/', routes.index );
app.post('/login', routes.login );
app.post('/logout', routes.logout );

// Custom Hello World Activity Routes
app.post('/journeybuilder/save/', activity.save );
app.post('/journeybuilder/validate/', activity.validate );
app.post('/journeybuilder/publish/', activity.publish );
app.post('/journeybuilder/execute/', activity.execute );

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//test
function getJSON(options, cb){	
	http.requests(options, function(res){
		var body = '';
		
		res.on('data', function(chunk){
			bod += chunk;			
		});
		
		res.on('end', function(){
			var result = JSON.parse(body);
			cb(null, result);				
		});
		
		res.on('error', cb);
	})
	.on('error', cb)
	.end();	
}

var options = {
	host: 'api-sandbox.oanda.com',
	port: 80,
	path: '/v1/quote?instruments=USA_ZAR',
	method: 'GET'	
};

getJSON(options, function(err, result){
	if (err){
		return console.log('Error while trying to get price: ', err);
	}
	
	console.log(result);
});


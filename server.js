/* 
    server.js
    mongodb-rest

    Created by Tom de Grunt on 2010-10-03.
    Copyright (c) 2010 Tom de Grunt.
		This file is part of mongodb-rest.
*/ 

var fs = require("fs"),
		util = require('util'),
		express = require('express');
		
var config = { "db": {
  'port': 27017,
  'host': "localhost"
  },
  'server': {
    'port': 3000,
    'address': "0.0.0.0"
  },
  'flavor': "regular",
  'debug': true
};

var app = module.exports.app = express.createServer();

try {
  config = JSON.parse(fs.readFileSync(process.cwd()+"/config.json"));
} catch(e) {
  // ignore
}

module.exports.config = config;

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.static(process.cwd() + '/public'));
    app.use(express.logger());
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
	
	if (config.accessControl){
		var accesscontrol = require('./lib/accesscontrol');
		app.use(accesscontrol.handle);
	}	
});


/**
 * Check If request route method Is Allowed
 */
function checkIfRouteIsAllowed( request,response,next ) {
  var method = request.route.method;
  var test = false;
  var allowedMethods = config.routes.allowMethods.split(',');
  console.log("config.routes.allowMethods",allowedMethods);
  for( i in allowedMethods ) {
    console.log("allowed,given",allowedMethods[i] ,method);
    if( method === allowedMethods[i] ) {
      test = true;
      break;
    }
  }
  if(test === false) {
    response.jsonp('{"ok":"0","status":"invalid route"}');
  } else {
    next();/*can continue with request*/	
  }
}
app.all('*',checkIfRouteIsAllowed);

require('./lib/main');
require('./lib/command');
require('./lib/rest');

if(!process.argv[2] || !process.argv[2].indexOf("expresso")) {
  app.listen(config.server.port, config.server.address);
}

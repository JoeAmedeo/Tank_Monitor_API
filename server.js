var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var mongoClient = mongodb.MongoClient;
var connectionString = process.env.MONGO_CONNECTION_STRING;

var app = express();

app.use(bodyParser.json());

app.get('/', function(req, res) {
	mongoClient.connect(connectionString, function(error, database){
		if (error) throw error;
		var dbo = database.db("SensorData");
		var query17 = { gpio_number: "17"};
		var query18 = { gpio_number: "18"};
		var sortObject = { time: -1 };
		var result17 = dbo.collection("Data").find(query17).sort(sortObject).limit(1);
		var result18 = dbo.collection("Data").find(query18).sort(sortObject).limit(1);
		var finalResult = { 17: result17, 18: result18 };
		res.send(JSON.stringify(finalResult));
		dbo.close();
	})
});

app.get('/:returnCount', function(req, res) {
	mongoClient.connect(connectionString, function(error, database){
		if (error) throw error;
		var dbo = database.db("SensorData");
		var query17 = { gpio_number: "17"};
		var query18 = { gpio_number: "18"};
		var sortObject = { time: -1 };
		var result17 = dbo.collection("Data").find(query17).sort(sortObject).limit(parseInt(req.params.returnCount)).toArray();
		var result18 = dbo.collection("Data").find(query18).sort(sortObject).limit(parseInt(req.params.returnCount)).toArray();
		var finalResult = { 17: result17, 18: result18 };
		res.send(finalResult);
		dbo.close();
	})
});

app.put('/', function(req, res){
	mongoClient.connect(connectionString, function(error, database){
		if (error) throw error;
		var dbo = database.db("SensorData");
		dbo.collection("Data").insertOne(request.body, function(error, response){
			if (error) throw error
			res.status(204);
			res.send();
			dbo.close();
		})
	})
});

app.listen(process.env.PORT);

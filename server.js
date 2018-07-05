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
		var dbo = database.db('SensorData');
		dbo.collection('Data').find({}).toArray(function(err, result){
			if (err) throw err;
			console.log(result);
			res.json(result);
			database.close();
		});
	})
});

app.get('/:sensorNumber/:rowCount', function(req, res) {
	mongoClient.connect(connectionString, function(error, database){
		if (error) throw error;
		var dbo = database.db('SensorData');
		var query = { gpio_number: req.params.sensorNumber};
		var sortObject = { time: -1 };
		dbo.collection('Data').find(query).sort(sortObject).limit(parseInt(req.params.rowCount)).toArray(function(err, result){
			if (err) throw err;
			console.log(result);
			res.json(result);
			database.close();
		});
		
	})
});

app.put('/', function(req, res){
	mongoClient.connect(connectionString, function(error, database){
		if (error) throw error;
		var dbo = database.db('SensorData');
		dbo.collection('Data').insertOne(req.body, function(error, res){
			if (error) throw error
			res.status(204);
			res.send();
			database.close();
		})
	})
});

app.listen(process.env.PORT);

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
		var finalResult = {};
		var dbo = database.db('SensorData');
		var query17 = { gpio_number: '17'};
		var query18 = { gpio_number: '18'};
		var sortObject = { time: -1 };
		finalResult.sensor1 = dbo.collection('Data').find(query17).sort(sortObject).limit(1).toArray(function(err, result){
			if (err) throw err;
			console.log(result);
		});
		finalResult.sensor2 = dbo.collection('Data').find(query18).sort(sortObject).limit(1).toArray(function(err, result){
			if (err) throw err;
			console.log(result);
		});
		console.log(finalResult);
		res.json(finalResult);
		database.close();
	})
});

app.get('/:returnCount', function(req, res) {
	mongoClient.connect(connectionString, function(error, database){
		if (error) throw error;
		var dbo = database.db('SensorData');
		var query17 = { gpio_number: '17'};
		var query18 = { gpio_number: '18'};
		var sortObject = { time: -1 };
		var result17 = dbo.collection('Data').find(query17).sort(sortObject).limit(parseInt(req.params.returnCount)).toArray(function(err, result){
			if (err) throw err
			console.log(result)
		});
		var result18 = dbo.collection('Data').find(query18).sort(sortObject).limit(parseInt(req.params.returnCount)).toArray(function(err, result){
			if (err) throw err
			console.log(result)
		});
		var finalResult = { '17': result17, '18': result18 };
		console.log(finalResult);
		res.json(finalResult);
		database.close();
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

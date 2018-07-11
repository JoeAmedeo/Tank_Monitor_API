var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var mongoClient = mongodb.MongoClient;
var connectionString = process.env.MONGO_CONNECTION_STRING;

var app = express();

// We only need to parse jsons in this api, so we will only use 1 of 3 bodyParser functions
app.use(bodyParser.json());

// GET: will return all entries in the database when called
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

/*
 * POST: will take in a JSON with two parameters, sensorNumber and rowCount
 * The query will find all database entries with the given sensor number.
 * This result will be ordered by date (most recent to least recent entry)
 * and the row count will limit how many rows will be sent back in the response.
 */
app.post('/', function(req, res) {
	mongoClient.connect(connectionString, function(error, database){
		if (error) throw error;
		var dbo = database.db('SensorData');
		var query = { gpio_number: req.body.sensorNumber};
		var limit = parseInt(req.body.rowCount);
		var sort = { time: -1 };
		dbo.collection('Data').find(query).sort(sort).limit(limit).toArray(function(err, result){
			if (err) throw err;
			console.log(result);
			res.json(result);
			database.close();
		});
		
	})
});

// PUT: will insert the given JSON into the database when called
app.put('/', function(req, res){
	mongoClient.connect(connectionString, function(error, database){
		if (error) throw error;
		var dbo = database.db('SensorData');
		dbo.collection('Data').insertOne(req.body, function(err, result){
			if (err) throw err
			res.status(204);
			res.send();
			database.close();
		})
	})
});

/*
 * DELETE: This will take a JSON object as an input containing sensorNumber
 * sensorNumber will be used to query the database for a given gpio number
 * this function will just delete the oldest entry of the given sensor number.
 */
app.delete('/', function (req, res){
	mongoClient.connect(connectionString, function(error, database){
		if (error) throw error;
		var dbo = database.db('SensorData');
		var query = { gpio_number: req.body.sensorNumber };
		var sort = {time: 1};
		dbo.collection('Data').sort(sort).DeleteOne(query, function(err, result){
			if (err) throw err;
			res.status(204);
			res.send();
			database.close();
		})
	})
});

app.listen(process.env.PORT);

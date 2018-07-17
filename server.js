var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var mongoClient = mongodb.MongoClient;
var connectionString = process.env.MONGO_CONNECTION_STRING;

var app = express();

// We only need to parse jsons in this api, so we will only use 1 of 3 bodyParser functions
app.use(bodyParser.json());

/**
 * @api {get} / Request all sensor data
 * @apiName TANK_MONITOR_API
 * @apiGroup TANK_MONITOR
 *
 * @apiSuccess {Number} _id 		Unique identifier for the entry.
 * @apiSuccess {Number} gpio_number Number which corresponds to a given sensor.
 * @apiSuccess {String} time 		Date and Time at which this sensor reading occured.
 * @apiSuccess {Number} tempurature Tempurature the given sensor read.
 * @apiSuccess {Number} humidity 	Humidity the given sensor read.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [{"_id":"5b2252333ec414b3e46915e0","gpio_number":"17","time":"2018-06-14 12:00:00","tempurature":"30.5","humidity":"60.711"},{"_id":"5b2252b73ec414b3e46915e1","gpio_number":"18","time":"2018-06-14 12:00:00","tempurature":"30.5","humidity":"58.312"}]
 *
 */
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
	});
});

/**
 * @api {get} /count Request the number of entries in the database
 * @apiName TANK_MONITOR_API
 * @apiGroup TANK_MONITOR
 *
 * @apiSuccess {Number} count The number of entries in the database
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 * 			"count": 22
 * 	   }
 *
 */
app.get('/count', function(req, res) {
	mongoClient.connect(connectionString, function (error, database){
		if (error) throw error;
		var dbo = database.db('SensorData');
		dbo.collection('Data').find({}).toArray(function(err, result){
			if (err) throw err;
			console.log(result.length)
			res.json({'count': result.length});
			databse.close();
		});
	});
});

/**
 * @api {post} / Request data from a given sensor for a given quantity
 * @apiName TANK_MONITOR_API
 * @apiGroup TANK_MONITOR
 * 
 * @apiParam {Number} sensorNumber The sensor which you want to query
 * @apiParam {Number} rowCount The number of rows you want returned
 *
 * @apiSuccess {Number} _id Unique 	identifier for the entry.
 * @apiSuccess {Number} gpio_number Number which corresponds to a given sensor.
 * @apiSuccess {String} time 		Date and Time at which this sensor reading occured.
 * @apiSuccess {Number} tempurature Tempurature the given sensor read.
 * @apiSuccess {Number} humidity 	Humidity the given sensor read.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [{"_id":"5b2252333ec414b3e46915e0","gpio_number":"17","time":"2018-06-14 12:00:00","tempurature":"30.5","humidity":"60.711"}]
 *
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
	});
});

/**
 * @api {put} / Put data into database
 * @apiName TANK_MONITOR_API
 * @apiGroup TANK_MONITOR
 *
 * @apiParam {Number} gpio_number 	Number which corresponds to a given sensor.
 * @apiParam {String} time 			Date and Time at which this sensor reading occured.
 * @apiParam {Number} tempurature 	Tempurature the given sensor read.
 * @apiParam {Number} humidity 		Humidity the given sensor read.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 204 No Content
 *
 */
app.put('/', function(req, res){
	mongoClient.connect(connectionString, function(error, database){
		if (error) throw error;
		var dbo = database.db('SensorData');
		dbo.collection('Data').insertOne(req.body, function(err, result){
			if (err) throw err
			res.status(204);
			res.send();
			database.close();
		});
	});
});

/**
 * @api {delete} / delete the oldest entry of a given sensor number
 * @apiName TANK_MONITOR_API
 * @apiGroup TANK_MONITOR
 *
 * @apiParam {Number} sensorNumber The sensor number we want to remove the oldest entry for
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 204 No Content
 *
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

module.exports = server;

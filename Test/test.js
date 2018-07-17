var express = require('express');
var request = require('supertest');

var server;

describe('My Server', function() {

    this.beforeEach(function(done){
        server = require('../server'); 
    });

    // GET: get 200 status and don't retrn null
    request(server)
        .get('/')
        .set('Content-Type', /json/)
        .expect(200, function(err, res) {
            if (err) {return done(err);} 
            callStatus = res.body
            expect(callStatus).to.not.equal(null);
            done();
        });
    
    // Get: get 200 status and return integer of count
    request(server)
        .get('/count')
        .set('Content-Type', /json/)
        .expect(200, function(err, res) {
            if (err) {return done(err);} 
            callStatus = res.body.count
            expect(typeof(callStatus)).to.equal("number");
            done();
        });
    
    // POST: request should send response 200, response should have gpio number of 17, and response should be length 2
    request(server)
        .post('/')
        .set('Content-Type', /json/)
        .send({sensorNumber: 17, rowCount: 2})
        .expect(200, function(err, res) {
            if (err) {return done(err);} 
            callStatus = res.body;
            expect(callStatus.length).to.equal(2);
            expect(callStatus[0].gpio_number).to.equal(17);
            done();
        });
    
    // PUT: request should give a 204 response
    request(server)
        .put('/')
        .set('Content-Type', /json/)
        .send({gpio_number: 1, })
        .expect(204, function(err, res) {
            if (err) {return done(err);} 
            callStatus = res.body;
            done();
        });
    
    // DELETE: request should give a 204 response
    request(server)
        .delete('/')
        .set('Content-Type', /json/)
        .send({gpio_number: 1, })
        .expect(204, function(err, res) {
            if (err) {return done(err);} 
            callStatus = res.body;
            done();
        });
});

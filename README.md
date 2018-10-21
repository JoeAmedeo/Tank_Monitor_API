# Tank_Monitor_API

## Inspiration:

This API exists as a tool to interface with the Tank Monitoring System I am creating. This tool will be used for running simple CRUD operations between the Raspberry Pi and the Android app.

## Technologies:

#### Node.js
Seeing as Javascript is pretty trendy right now, and the convenient libraries that exist for interfacing node apps with MongoDB, Node was my go-to for the service layer of this application. The Node app uses the following packages...
  - Express: The standard web server framework for Node
  - MongoDB: For interfacing with a Mongo Database
  - Mocha: Unit Testing Framework
  - SuperTest: Unit Testing Framework

#### MongoDB
 Since the data for this application wouldn't benefit extremely from being relational, I chose MongoDB over SQL for being cheaper (was able to get 512GB on a cloud service for free with Mongo vs 10000 rows of SQL)
 
## Features

- [x] CRUD Operations
  - [x] PUT
  - [x] GET
  - [x] POST
  - [x] DELETE
- [x] Cloud Deployment
- [x] Unit Tests
- [x] Documentation / Comments
- [x] Container Implementation
- [ ] Framework Testing
  - [ ] Mocha / Chai Unit Tests
  - [ ] Mongoose
- [ ] The Things I Haven't Thought of Yet

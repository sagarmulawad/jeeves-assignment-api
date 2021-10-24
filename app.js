// modules =================================================
var express = require('express');
var app = express();
process.env.NODE_ENV = 'development';
const config = require('./config/config.json')[process.env.NODE_ENV];
const cors = require('cors');
const passport = require('passport');
var mongoose = require('mongoose');
const path = require('path');
mongoose.set('useFindAndModify', false);

app.use(cors());
// connect to our mongoDB database 
mongoose.connect(config.db_url, { useNewUrlParser: true, useCreateIndex: true });

mongoose.connection.on("connected", function () {
	console.log("Connected to DB");
	// logger.info("connected to db");
});
mongoose.connection.on('error', () => {
	console.log("error in Connecting to DB");
	// logger.error("error in connecting to db" + err);

});


// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/resources'));
app.use("/public", express.static(path.join(__dirname, 'public')));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/PassportConfig')(passport);

app.use('/users', require('./controllers/UserController'));

app.get('*', function (req, res) {
	res.send('invalid rest point');
})

var server = require('http').Server(app);
server.listen(config.node_port, () => {
	console.log('server started:' + config.node_port);
});
exports = module.exports = app;


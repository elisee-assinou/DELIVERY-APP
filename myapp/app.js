const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const mongoDBURI = process.env.MONGODB_URI;

mongoose.connect(mongoDBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const cors = require('cors');


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var WebSocket = require('ws'); // module ws

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users.route');
const packagesRoutes = require('./routes/packages.route');
const deliveryRoutes = require('./routes/deliveries.route');
const setupWebSocket = require('./websocketServer'); // import de notre module websocket

const app = express();
app.use(cors());

const server = http.createServer(app); // Cration du serveur HTTP

// Configuration de l'application Express
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', packagesRoutes);
app.use('/api', deliveryRoutes);

// ROUTE POUR LES SOCKETS
app.use('/websocket', (req, res, next) => {
  setupWebSocket(server).handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
    setupWebSocket(server).emit('connection', ws, req);
  });
});



// Gestion des erreurs 404 et erreurs
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

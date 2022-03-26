var db  = require('./models');
const express = require('express')
const session = require('express-session');

const app = require('express')(),
server = require('http').createServer(app),
io = require('socket.io').listen(server),
ent = require('ent');
const bodyParser = require('body-parser')
const {CasparCG} = require("casparcg-connection");
var con = new CasparCG('192.168.44.173',5250);

var flash    = require('connect-flash');
var passport = require('passport');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var models = require("./models");
var router = require('./app/route');

const debug = require('debug')('my-namespace')
const name = 'my-app'
debug('booting %s', name)

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/assets'));
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}))

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport,models.utilisateur);
app.use(flash());


app.use(morgan('dev')); //
app.use(cookieParser());


require('./app/route.js')(app,passport,db,io,ent,con);
server.listen(process.env.PORT || "3000", '0.0.0.0', () => {
	console.log('listening on 3000')
})

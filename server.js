
// set up ======================================================================
var express  = require('express');
const { createServer } = require("node:http");
var port     = process.env.PORT || 8065;
const MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
const { Server } = require("socket.io");
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
const { ObjectId } = require('mongodb');
const { User,Msg } = require('./app/models/user.js');

var app      = express();
const httpServer = createServer(app)
var configDB 
// console.log(process.env)
try{
 configDB = require('./config/database.js');
}catch(err){
  configDB = {
    url : process.env.url
  }
}

var db

// configuration ===============================================================
mongoose.connect(configDB.url,(err, database) => {
  if (err) return console.log(err)
  db = database
console.log('connected to db')
  require('./app/routes.js')(app, passport, db);
}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use('/uploads', express.static('uploads'));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport

const sessionMiddleware = session({
  
    secret: 'rcbootcamp2021b', // session secret
    resave: true,
    saveUninitialized: true

});

app.use(sessionMiddleware)
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// launch ======================================================================

console.log('The magic happens on port ' + port);


const io = new Server(httpServer);

function onlyForHandshake(middleware) {
  return (req, res, next) => {
    const isHandshake = req._query.sid === undefined;
    if (isHandshake) {
      middleware(req, res, next);
    } else {
      next();
    }
  };
}

io.engine.use(onlyForHandshake(sessionMiddleware));
io.engine.use(onlyForHandshake(passport.session()));
io.engine.use(
  onlyForHandshake((req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.writeHead(401);
      res.end();
    }
  }),
);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // Handle other custom events here
  socket.on('chat message', async (msg) => {
    msg.from = socket.request.user._id
    console.log(msg)
    // console.log(socket.request)
    io.emit('chat message', msg); // Broadcast the message to all clients
   let client 
   let provider

   if(socket.request.user.local.userType=="families"){
    client=socket.request.user
    provider=await User.findById(msg.to)
   }else{
    client=await User.findById(msg.to)
    provider=socket.request.user
   }
    if(!provider.local.clientMsgs){
      provider.local.clientMsgs=[]
    }
let msgObj=provider.local.clientMsgs.filter(sentMsg=>(sentMsg.from.equals(client._id)))[0]
if(!msgObj){
  msgObj=new Msg()
  msgObj.from=client._id
  msgObj.msg=[]
  provider.local.clientMsgs.push(msgObj)
}

msgObj.msg.push({
  date:msg.date,
  content:msg.content,
  sent:msg.from.equals(provider._id)
})
provider.save()
msgObj.save()
  });

});

app.set('socketio', io)
// app.listen(port);
httpServer.listen(port, ()=> {
  console.log(`application is running at: http://localhost:${port}`);
})

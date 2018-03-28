let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let bodyParser = require('body-parser');
let crypto = require('crypto');
const skey = '8888887';


// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const MongoClient = require('mongodb').MongoClient;

let rooms = [];

io.on('connection', (socket) => {
  console.log('USER CONNECTED');

  socket.on('disconnect', function(){
    console.log('USER DISCONNECTED');
  });

  socket.on('add-message', (message,id) => {
    console.log(id);
    io.emit(id, {type:'new-message', text: message});
    console.log(message);
    rooms.push(id);
    console.log(rooms);
  });

  socket.on('player', (message,id) => {
    rooms.push(message)
    io.emit(id, {type:'command', text: message});
  });

});


app.get("/test", function(request, response){

  // console.log(request.query.key);

// response.send(request.query.key);
    response.send(hash);
});

app.post('/login', function (req, res) {
const url = 'mongodb://localhost:27017';
const dbName = 'audcloud';
    MongoClient.connect(url, function(err, client) {
        console.log("Connected successfully to server");
        const db = client.db(dbName);
      // db.collection('users').insert({email : 'admin@audline.net', password : 'nimda321'});
      const lorem = db.collection('users').find(req.body).toArray(function (err,docs) {
        if (docs[0]) {
          const hash = crypto.createHmac('sha256', skey)
          .update(docs[0].password + docs[0].email)
          .digest('hex');
          db.collection('users').update(req.body,{$set : {sid : hash}});
          // console.log('hash');
          res.send({'sid': hash});
        }
        else res.send({});
      });
      });
  // res.send(req.body);
  // console.log(req.query);
});

app.get('/my_playlist', function (req, res) {

  const url = 'mongodb://localhost:27017';
  const dbName = 'audcloud';
      MongoClient.connect(url, function(err, client) {
          const db = client.db(dbName);
        const lorem = db.collection('users').update({'sid' : req.query.sid},{$push: {
          'audio_liked' : { 'id' : req.query.track} }});
        });
     res.send({});
  
  });


  app.post('/audio_load', function (req, res) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'audcloud';
        MongoClient.connect(url, function(err, client) {

            const db = client.db(dbName);
          // db.collection('users').insert({email : 'admin@audline.net', password : 'nimda321'});
          // db.collection('audio').insert(req.body);
          console.log(req.body);
          
          });
     
      // console.log(req.query);
    });


http.listen(3000, () => {
  console.log('started on port 3000');
});


let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let bodyParser = require('body-parser');

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

  console.log(request.query.key);
     
    response.send("<h1>О сайте</h1>");
});

app.post('/login', function (req, res) {

// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'audcloud';
// Use connect method to connect to the server

    MongoClient.connect(url, function(err, client) {
        console.log("Connected successfully to server");
        const db = client.db(dbName);
      // db.collection('users').insert({email : 'admin@audline.net', password : 'nimda321'});
      const lorme = db.collection('users').find(req.body).toArray(function (err,docs) {
        res.send(docs);
        console.log(docs);
      });
      });


  // res.send(req.body);
  console.log(req.query);
})


http.listen(3000, () => {
  console.log('started on port 3000');
});
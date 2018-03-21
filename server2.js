var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


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

io.on('connection', (socket) => {
    console.log('USER CONNECTED');
  
    socket.on('disconnect', function(){
      console.log('USER DISCONNECTED');
    });
  
    socket.on('add-message', (message) => {
      io.emit('message', {type:'new-message', text: message});
    });
  });


const MongoClient = require('mongodb').MongoClient;




// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'test';
 
// Use connect method to connect to the server

app.get("/", function(request, response){

    MongoClient.connect(url, function(err, client) {

        console.log("Connected successfully to server");

        const db = client.db(dbName);

      db.collection('users').insert({name : 'Lorem'});
      
      const lorme = db.collection('users').find().toArray(function (err,docs) {
        response.send(docs);
      });
      });
    
});
app.get("/about", function(request, response){
     
    response.send("<h1>О сайте</h1>");
});
app.get("/contact", function(request, response){
     
    response.send("<h1>Контакты</h1>");
});
app.listen(3000);
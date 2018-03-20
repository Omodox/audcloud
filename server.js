var express = require("express");
var app = express();


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
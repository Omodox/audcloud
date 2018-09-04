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
ObjectId = require('mongodb').ObjectID;

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

app.post('/my_playlist', function (req, res) {

  const url = 'mongodb://localhost:27017';
  const dbName = 'audcloud';
      MongoClient.connect(url, function(err, client) {
          const db = client.db(dbName);
          // console.log(req.body.sid);
    db.collection('users').find(
      {$and : 
        [
          {audio_liked: 
            {$elemMatch: 
              { _id : req.body.track._id }
            }
          },
              {   sid : req.body.sid }
            ]
          }
        )
          .toArray(
            function (err,docs) { 
                if (docs.length <= 0) {
          db.collection('users').update({'sid' : req.body.sid},{$push: {
          'audio_liked' : { '_id' : req.body.track._id} }});
                }
                else {
                  db.collection('users').update( 
                  {sid : req.body.sid },
                  {
                    $pull :  
                        {audio_liked: 
                           
                            { _id : req.body.track._id }
                          
                        }  
                  }
                  );
                  console.log('will be soon');
                }
        
            }
           );
       
        }); 
     res.send({});
  
  });


  app.post('/my_blaclist', function (req, res) {

    const url = 'mongodb://localhost:27017';
    const dbName = 'audcloud';
        MongoClient.connect(url, function(err, client) {
            const db = client.db(dbName);
            // console.log(req.body.sid);
      db.collection('users').find(
        {$and : 
          [
            {audio_black_list: 
              {$elemMatch: 
                { _id : req.body.track._id }
              }
            },
                {   sid : req.body.sid }
              ]
            }
          )
            .toArray(
              function (err,docs) { 
                  if (docs.length <= 0) {
            db.collection('users').update({'sid' : req.body.sid},{$push: {
            'audio_black_list' : { '_id' : req.body.track._id} }});
                  }
                  else {
                    db.collection('users').update( 
                    {sid : req.body.sid },
                    {
                      $pull :  
                          {audio_black_list: 
                             
                              { _id : req.body.track._id }
                            
                          }  
                    }
                    );
                    console.log('will be soon');
                  }
          
              }
             );
         
          }); 
       res.send({});
    
    });


  app.get('/get_my_playlist', function (req, res) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'audcloud';
        MongoClient.connect(url, function(err, client) {
            const db = client.db(dbName);
             const lorem = db.collection('users').find({ sid : req.query.sid})
          .project({ audio_liked: 1, _id: 0 })
          .toArray(
            function (err,docs) {

              //  res.send(docs[0].audio_liked);

               var i = 0; 
               docs[0].audio_liked.forEach(element => {
                docs[0].audio_liked[i] = {_id: ObjectId(element._id) };
                 i++;
               });
              //  res.send(docs[0].audio_liked);
              const lorem = db.collection('audio').find({$or : docs[0].audio_liked}).sort({"_id" : -1})
              .toArray(
                function (err,docs) {
                  res.send(docs);
                }
              );  
            }
          );
          });   
    });


    app.get('/get_my_blacklist', function (req, res) {
      const url = 'mongodb://localhost:27017';
      const dbName = 'audcloud';
          MongoClient.connect(url, function(err, client) {
              const db = client.db(dbName);
               const lorem = db.collection('users').find({ sid : req.query.sid})
            .project({ audio_black_list: 1, _id: 0 })
            .toArray(
              function (err,docs) {
  
                //  res.send(docs[0].audio_liked);
  
                 var i = 0; 
                 docs[0].audio_black_list.forEach(element => {
                  docs[0].audio_black_list[i] = {_id: ObjectId(element._id) };
                   i++;
                 });
                //  res.send(docs[0].audio_liked);
                const lorem = db.collection('audio').find({$or : docs[0].audio_black_list})
                .toArray(
                  function (err,docs) {
                    res.send(docs);
                  }
                );
              }
            );
            });   
      });


  app.get('/audio', function (req, res) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'audcloud';
        MongoClient.connect(url, function(err, client) {
            const db = client.db(dbName);
          const audio_list =  db.collection('audio').aggregate([{$sample: {size: 150}}])
          .toArray(
            function (err,docs) {
              // console.log(docs);
              res.send(docs);
            }
          )
          }); 
    });

    app.get('/search', function (req, res) {
      const url = 'mongodb://localhost:27017';
      const dbName = 'audcloud';
          MongoClient.connect(url, function(err, client) {
              const db = client.db(dbName);
              if (req.query.q) {
                const audio_list =  db.collection('audio').find({$or : [
                  { 'name': new RegExp(req.query.q, 'i') },
                  { 'performer_name': new RegExp(req.query.q, 'i') }
                ]} )
                .toArray(
                  function (err,docs) {
                    // console.log(docs);
                    res.send(docs);
                  }
                )
              }
              console.log(req.query.g);
              if (req.query.g) {
                const audio_list =  db.collection('audio').find(
                  { 'genre': new RegExp(req.query.g, 'i') }
                )
                .toArray(
                  function (err,docs) {
                    // console.log(docs);
                    res.send(docs);
                  }
                )
              }
     
            }); 
      });

    app.get('/band', function (req, res) {
      const url = 'mongodb://localhost:27017';
      const dbName = 'audcloud';
          MongoClient.connect(url, function(err, client) {
              const db = client.db(dbName);
            const audio_list =  db.collection('audio').find({performer_url : req.query.band})
            .toArray(
              function (err,docs) {
                // console.log(docs);
                res.send(docs);
              }
            )
            }); 
  
      });



      app.post('/newtrack', function (req, res) {
        const url = 'mongodb://localhost:27017';
        const dbName = 'audcloud';
            MongoClient.connect(url, function(err, client) {
                const db = client.db(dbName);
       db.collection('audio').insert(req.body.track);

              }); 
           res.send(req.body);
        
        });


http.listen(3000, () => {
  console.log('started on port 3000');
});

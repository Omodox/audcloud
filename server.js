
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let rooms = [];

io.on('connection', (socket) => {
  console.log('USER CONNECTED');

  socket.on('disconnect', function(){
    console.log('USER DISCONNECTED');
  });

  socket.on('add-message', (message,id) => {
    console.log(id);
    io.emit(id, {type:'new-message', text: message});
    // console.log(message);
    rooms.push(id);
    console.log(rooms);
  });

  socket.on('player', (message,id) => {
    io.emit(id, {type:'command', text: message});
   
   
  });

});


app.get("/about", function(request, response){
     
    response.send("<h1>О сайте</h1>");
});

http.listen(3000, () => {
  console.log('started on port 3000');
});
var helmet = require('helmet');

const express = require('express');

// const app = express();

// var express = require('express'), http = require('http');
//make sure you keep this order
// var app = express();
// var server = http.createServer(app);
// var io = require('socket.io').listen(server);

// var app = require('express')();
// var http = require('http').createServer(app);
// var io = require('socket.io')(http);

var http = require('http');
var app = express();
var server = http.createServer(app);

var io = require('socket.io').listen(server);

// var app = require('express')();
// var http = require('http').createServer(app);
// var io = require('socket.io').listen(server);



app.get('/', (req,res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname))
app.use(express.static('public'));


//this stuff all connects to the client
io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('create or join', function(room){
    console.log('create or join to room ', room);

    //count users in room
    var myRoom = io.sockets.adapter.rooms[room] || {length:0};
    var numClients = myRoom.length;
    console.log(room, ' has ', numClients, ' clients');

    if (numClients == 0){
        socket.join(room);
        socket.emit('created',room);
    }else if(numClients == 1){
      socket.join(room);
      socket.emit('joined', room);
    }else{
      socket.emit('full',room)
    }
  });

  socket.on('ready', function(room){
    socket.broadcast.to(room).emit('ready');
  });

  socket.on('candidate', function(event){
    socket.broadcast.to(event.room).emit('offer',event.sdp);
  });

  socket.on('answer', function(event){
    socket.broadcast.to(event.room).emit('answer',event.sdp);
  });
});

//listener
// http.listen(3000, () =>{
//   console.log('listening on *:3000');
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {http.listen(port, () =>{
//   	    console.log(`Our app is running on port ${ PORT }`);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
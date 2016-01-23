
var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use(express.static('public'));

var list = new Uint8Array(1000);  
var io = require('socket.io')(http);
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
 
    for (var i = 0; i < list.length; i++) 
    { 
        list[i]=Math.floor(Math.random()*256) ; 
    };
    setInterval(function(){  
        for (var i = 0; i < list.length; i++) 
            { 
                list[i]+= Math.random()-0.1 ; 
            };     
        io.emit('move', list);
  }, 15); 
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

/// <reference path="../Typings/node/node.d.ts" />
/// <reference path="../Typings/socket.io/socket.io.d.ts" />
/// <reference path="../Typings/express/express.d.ts" />
/// <reference path="Board.ts" />
/// <reference path="Player.ts" />
/// <reference path="List.ts" />
/// <reference path="PlayerAction.ts" />
/// <reference path="ServerWeb.ts" />



class Server{
    serverHTTP : ServerWeb;
    
    constructor (){
        this.serverHTTP = new ServerWeb();
        this.serverHTTP.run();
    }
    
    SetupScreenSocket(){
        var board: Board = new Board(40, 20);
        var moves = [];
        var NewId = 0;
        var players: List<Player> = new List<Player>();
        
        var io: SocketIO.Server = require('socket.io')(this.serverHTTP.http);
        
        var screenServer: SocketIO.Socket = require('socket.io')(3001);
        
        //screen
        
        screenServer.on('connection', function(socket) {
            console.log('screen connected');

            socket.on("BoardInfo?", function() {
                socket.emit("BoardInfo", board);
            });

            socket.on("PlayerInfo?", function() {
                socket.emit("PlayerInfo", players.array);
            });
            
            socket.on("text", function(data) {
               
            });

            socket.on('disconnect', function() {
                console.log('screen disconnected');
            });
        });
        
        setInterval(function() {
            if (moves.length > 0) {
                screenServer.emit("moves", moves);
                moves = [];
            }
        }, 15);

        // CLient
        
        io.on('connection', function(socket) {
            var playerAction: PlayerAction = new PlayerAction();
            var player = new Player();
            player.id = NewId;
            player.energy = 1000;
            player.position = new position();
            NewId++;
            players.add(player);
            playerAction.id = player.id;
            setInterval(function() {
                player.energy += 1;
            }, 1500);

            console.log('connected player ' + player.id);
            screenServer.emit("join", playerAction.id);

            //verifier
            socket.on('event', function(data) {
                console.log("caca " + data);
            });

            socket.on("input", function(data) {
                screenServer.emit("input",{id : player.id , d : data, position : player.position });
            });
            
            socket.on("abort", function(data) {
                screenServer.emit("abort",{id : player.id , d : data, position : player.position });
            });
            
            socket.on("create", function(data) {
                screenServer.emit("create",{id : player.id , d : player.position});
            });
            
            socket.on("move", function(data: position) {
                var energyNeeded = Math.abs(data.x) + Math.abs(data.y)
                if (player.energy - energyNeeded < 0) return;
                player.energy -= (energyNeeded);
               
                player.position.add(data);
                player.position = player.position ;//  board.ClampMove(player.position);
                playerAction.player = player;
                playerAction.position = player.position;
                moves.push(playerAction);
                
                //screenServer.emit("move", playerAction)
            });

            socket.on('disconnect', function() {
                console.log('disconnected player ' + player.id);
                screenServer.emit("leave", playerAction.id);
                players.remove(player);
            });
        });
    }
}

var test = new Server();
test.SetupScreenSocket();





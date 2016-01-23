var position = (function () {
    function position() {
        this.x = 0;
        this.y = 0;
    }
    position.prototype.add = function (pos) {
        this.x += pos.x;
        this.y += pos.y;
    };
    return position;
})();
/// <reference path="Position.ts" />
var Board = (function () {
    function Board(X, Y) {
        this.X = X;
        this.Y = Y;
    }
    Board.prototype.clamp = function (val, min, max) {
        return Math.min(Math.max(val, min), max);
    };
    Board.prototype.ClampMove = function (pos) {
        this.x = 6;
        this.y = 5;
        pos.x = this.clamp(pos.x, 0, this.X - this.x);
        pos.y = this.clamp(pos.y, 0, this.Y - this.y);
        return pos;
    };
    return Board;
})();
////// <reference path="Position" />
var Player = (function () {
    function Player() {
    }
    return Player;
})();
var List = (function () {
    function List() {
        this.array = [];
    }
    List.prototype.count = function () {
        return this.array.length;
    };
    List.prototype.indexOf = function (item) {
        return this.array.indexOf(item);
    };
    List.prototype.atIndex = function (index) {
        return this.array[index];
    };
    List.prototype.insert = function (item, at) {
        this.array.splice(at, 0, item);
        if (!!this.changeEvent)
            this.changeEvent();
    };
    List.prototype.add = function (item) {
        this.array.push(item);
        if (!!this.changeEvent)
            this.changeEvent();
    };
    List.prototype.contains = function (item) {
        return this.array.indexOf(item) > -1;
    };
    List.prototype.clear = function () {
        this.array = [];
        if (!!this.changeEvent)
            this.changeEvent();
    };
    List.prototype.remove = function (item) {
        var index = this.array.indexOf(item);
        if (index > -1) {
            this.array.splice(index, 1);
            if (!!this.changeEvent)
                this.changeEvent();
        }
        return index > -1;
    };
    return List;
})();
////// <reference path="position" />
var PlayerAction = (function () {
    function PlayerAction() {
    }
    return PlayerAction;
})();
/// <reference path="../Typings/node/node.d.ts" />
var ServerWeb = (function () {
    //passport;
    function ServerWeb() {
        this.port = 3000;
        this.port = 3000;
        this.express = require('express');
        this.app = this.express();
        this.http = require('http').Server(this.app);
        this.app.use(this.express.static('public'));
    }
    ServerWeb.prototype.run = function () {
        this.http.listen(this.port, function () {
            console.log('Express server listening on port ' + this.port);
        });
    };
    return ServerWeb;
})();
/// <reference path="../Typings/node/node.d.ts" />
/// <reference path="../Typings/socket.io/socket.io.d.ts" />
/// <reference path="../Typings/express/express.d.ts" />
/// <reference path="Board.ts" />
/// <reference path="Player.ts" />
/// <reference path="List.ts" />
/// <reference path="PlayerAction.ts" />
/// <reference path="ServerWeb.ts" />
var Server = (function () {
    function Server() {
        this.serverHTTP = new ServerWeb();
        this.serverHTTP.run();
    }
    Server.prototype.SetupScreenSocket = function () {
        var board = new Board(40, 20);
        var moves = [];
        var NewId = 0;
        var players = new List();
        var io = require('socket.io')(this.serverHTTP.http);
        var screenServer = require('socket.io')(3001);
        //screen
        screenServer.on('connection', function (socket) {
            console.log('screen connected');
            socket.on("BoardInfo?", function () {
                socket.emit("BoardInfo", board);
            });
            socket.on("PlayerInfo?", function () {
                socket.emit("PlayerInfo", players.array);
            });
            socket.on("text", function (data) {
            });
            socket.on('disconnect', function () {
                console.log('screen disconnected');
            });
        });
        setInterval(function () {
            if (moves.length > 0) {
                screenServer.emit("moves", moves);
                moves = [];
            }
        }, 15);
        // CLient
        io.on('connection', function (socket) {
            var playerAction = new PlayerAction();
            var player = new Player();
            player.id = NewId;
            player.energy = 1000;
            player.position = new position();
            NewId++;
            players.add(player);
            playerAction.id = player.id;
            setInterval(function () {
                player.energy += 1;
            }, 1500);
            console.log('connected player ' + player.id);
            screenServer.emit("join", playerAction.id);
            //verifier
            socket.on('event', function (data) {
                console.log("caca " + data);
            });
            socket.on("input", function (data) {
                screenServer.emit("input", { id: player.id, d: data, position: player.position });
            });
            socket.on("abort", function (data) {
                screenServer.emit("abort", { id: player.id, d: data, position: player.position });
            });
            socket.on("create", function (data) {
                screenServer.emit("create", { id: player.id, d: player.position });
            });
            socket.on("move", function (data) {
                var energyNeeded = Math.abs(data.x) + Math.abs(data.y);
                if (player.energy - energyNeeded < 0)
                    return;
                player.energy -= (energyNeeded);
                player.position.add(data);
                player.position = player.position; //  board.ClampMove(player.position);
                playerAction.player = player;
                playerAction.position = player.position;
                moves.push(playerAction);
                //screenServer.emit("move", playerAction)
            });
            socket.on('disconnect', function () {
                console.log('disconnected player ' + player.id);
                screenServer.emit("leave", playerAction.id);
                players.remove(player);
            });
        });
    };
    return Server;
})();
var test = new Server();
test.SetupScreenSocket();

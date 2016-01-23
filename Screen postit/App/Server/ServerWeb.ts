/// <reference path="../Typings/node/node.d.ts" />


class ServerWeb {
    express: any;
    http: any;
    app:any; 
    port : number = 3000;
    //passport;

    constructor() {
        this.port = 3000;
        this.express = require('express');
        this.app = this.express();
        this.http = require('http').Server(this.app);
        this.app.use(this.express.static('public'));
    }

    run() {
        this.http.listen(this.port, function() {
            console.log('Express server listening on port ' + this.port); 
        });
    }
}
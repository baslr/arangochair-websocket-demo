
const arangochair = require('arangochair');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
server.listen(3000);

app.use(express.static(__dirname));


const no4 = new arangochair('http://127.0.0.1:8529'); // ArangoDB node to monitor

no4.subscribe({collection:'users'});
no4.start();
no4.on('users', (doc, type) => {
    doc = JSON.parse(doc);
    console.log(type);
    console.log(doc);
    io.sockets.emit(type, doc);
});


no4.on('error', (err, httpStatus, headers, body) => {
    // arangochair stops on errors
    // check last http request
    no4.start();
});

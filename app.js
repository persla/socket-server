
const express = require('express');
const app = express();


const server = require('http').createServer(app);
const io = require('socket.io')(server);

// io.origins(['https://socket-client.jsramverk.me:443']);

let allMassage = [{ author: 'From admin', message: "Den här chatten skapades i nov 2019", timestamp: '2019-11-16 20:04:06'},
];


io.on('connection', (socket) => {
    console.log(socket.id);

    socket.emit('RECEIVE_MESSAGE_OLD', allMassage);

    // console.log(allMassage);
    socket.on('SEND_MESSAGE', function(data){
        io.emit('RECEIVE_MESSAGE', data);
        allMassage.push(data);
        // console.log(data);

    })

});

server.listen(5000);

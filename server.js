const net = require('net');

let sockets = [];

let tcpServer = net.createServer();

tcpServer.on('connection', (socket) => {
    console.log('connection made');
    // console.log(socket);

    socket.setEncoding('utf8');
    sockets.push(socket);

    socket.write('please enter your username:  ');

    socket.tracking = {
        username: '',
        justJoined: true
    }

    socket.on('data', (data) => {
        if (socket.tracking.justJoined === true) {
            socket.tracking.username = data;
            // let username = socket.tracking.username;
            sockets.forEach((thissocket) => {
                if (thissocket !== socket) {
                    thissocket.write(data + ' has just joined the chat');
                }
            });
            socket.tracking.justJoined = false;
        } else {
            for (let i = 0, l = sockets.length; i < l; i++) {
                if (sockets[i] === socket) continue;
                sockets[i].write(socket.tracking.username + ': ' + data);
            }
        }
    });



    socket.on('end', () => {
        sockets.splice(sockets.indexOf(socket, 1));
    })

});

tcpServer.listen(process.env.PORT || 8000);


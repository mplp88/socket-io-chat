const app = require('express')();
const cors = require('cors');
app.use(cors());
const http = require('http').createServer(app);
const io = require('socket.io')(http);
let port = 8082
let hostname = '192.168.60.140';


app.get('/', function (req, res) {
  res.send('<h1>Chat is online</h1>')
})

io.on('connection', function (socket) {
  socket.on('userConnected', function (userName) {
    console.log(`${userName} connected`);
    io.emit('userConnected', {
      user: -1,
      text: `${userName} connected`,
      isBroadcast: true
    });
  })

  socket.on('userDisconnected', function (userName) {
    console.log(`${userName} disconnected`);
    io.emit('userDisconnected', {
      user: -1,
      text: `${userName} disconnected`,
      isBroadcast: true
    });
  })

  socket.on('chatMessage', function (message) {
    console.log(`${message.userName} says: ${message.text}`);
    io.emit('chatMessage', message);
  });

  socket.on('pingServer', function (msg) {
    console.log('ping');
    io.emit('messageChannel', msg);
  });
});

http.listen(port, hostname, function () {
  console.log(`listening on http://${hostname}:${port}`);
});
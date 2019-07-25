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
  socket.on('connected', function (userName) {
    io.emit('connected', {
      user: -1,
      text: `${userName} connected`,
      isBroadcast: true
    });
  })

  socket.on('disconnected', function () {
    io.emit({
      user: -1,
      text: 'A user disconnected',
      isBroadcast: true
    });
  })

  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
  });
});

http.listen(port, hostname, function () {
  console.log(`listening on http://${hostname}:${port}`);
});
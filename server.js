const app = require('express')();
const cors = require('cors');
app.use(cors());
const http = require('http').createServer(app);
const io = require('socket.io')(http);
let port = process.env.PORT || 3002;
let hostname = process.HOST || 'http://localhost';
let contacts = []

app.get('/', function (req, res) {
  res.send('<h1>Chat is online</h1>')
})

io.on('connection', function (socket) {
  socket.on('userConnected', function (user) {
    console.log(`${user.userName} connected`);
    let msg = {
      user: -1,
      text: `${user.userName} connected`,
      isBroadcast: true
    };

    contacts.push(user)
    io.emit('userConnected', {
      msg,
      contacts: contacts
    });
  })

  socket.on('userDisconnected', function (user) {
    console.log(`${user.userName} disconnected`);

    contacts = contacts.filter(x => x.id != user.id);
    let msg = {
      user: -1,
      text: `${user.userName} disconnected`,
      isBroadcast: true
    };

    io.emit('userDisconnected',{
      msg,
      contacts: contacts
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
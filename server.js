const fs = require('fs'); //Uncomment for localhost
const app = require('express')();
const cors = require('cors');
app.use(cors());

//Uncomment for localhost
const options = {
  key: fs.readFileSync('./security/cert.key'),
  cert: fs.readFileSync('./security/cert.pem')
}

const http = require('https').createServer(options, app);
// const http = require('http').createServer(app);
const io = require('socket.io')(http);
let port = process.env.PORT || 3002;
//let hostname = process.env.HOST || 'localhost';
let users = [];
let messages = [];

app.get('/', function (req, res) {
  res.send('<h1>Pon-Chat Api is online</h1>')
})

io.on('connection', function (socket) {
  socket.on('userConnected', function (user) {
    let text = `${user.userName} se conectó`
    console.log(text);
    let msg = {
      user: -1,
      text,
      isBroadcast: true
    };

    users.push(user)

    socket.broadcast.emit('userConnected', {
      msg
    });
  })

  socket.on('userDisconnected', function (user) {
    let text = `${user.userName} se desconectó`
    console.log(text);

    users = users.filter(x => x.id != user.id);

    let msg = {
      user: -1,
      text,
      isBroadcast: true
    };

    socket.broadcast.emit('userDisconnected', {
      msg
    });
  })

  socket.on('refreshContacts', function () {
    io.emit('refreshContacts', users);
  });

  socket.on('chatMessage', function (message) {
    //console.log(`${message.userName} says: ${message.text}`);
    messages.push(message);
    message.status = 'sent';
    io.emit('chatMessage', message);
  });

  socket.on('updateStatus', function (message) {
    let msg = messages.find(m => m.id == message.id);
    console.log(`updateStatus: ${msg.id}, ${msg.status}`);
  })

  socket.on('pingServer', function (msg) {
    console.log('ping');
    io.emit('messageChannel', msg);
  });
});

http.listen(port, function () {
  //console.log(`listening on http://${hostname}:${port}`);
  console.log(`listening https://localhost:${port}`);
  // console.log(`listening http://localhost:${port}`);
});
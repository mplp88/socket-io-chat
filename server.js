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
let contacts = [];

app.get('/', function (req, res) {
  res.send('<h1>Chat is online</h1>')
})

io.on('connection', function (socket) {
  socket.on('userConnected', function (user) {
    console.log(`${user.userName} se conectó`);
    let msg = {
      user: -1,
      text: `${user.userName} se conectó`,
      isBroadcast: true
    };

    contacts.push(user)

    socket.broadcast.emit('userConnected', {
      msg
    });
  })
  
  socket.on('userDisconnected', function (user) {
    console.log(`${user.userName} se desconectó`);
    
    contacts = contacts.filter(x => x.id != user.id);

    let msg = {
      user: -1,
      text: `${user.userName} se desconectó`,
      isBroadcast: true
    };
    
    socket.broadcast.emit('userDisconnected',{
      msg
    });
  })
  
  socket.on('refreshContacts', function() {
    io.emit('refreshContacts', contacts);
  });

  socket.on('chatMessage', function (message) {
    console.log(`${message.userName} says: ${message.text}`);
    io.emit('chatMessage', message);
  });

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
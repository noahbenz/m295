const net = require('net');

const port = process.argv[2];

const server = net.createServer((socket) => {
  const now = new Date();
  
  const formattedDate = `${now.getFullYear()}-${padZero(now.getMonth() + 1)}-${padZero(now.getDate())} ${padZero(now.getHours())}:${padZero(now.getMinutes())}\n`;

  socket.write(formattedDate);

  socket.end();
});

server.listen(port);

function padZero(num) {
  return (num < 10 ? '0' : '') + num;
}

const net = require('net');
const fs = require('fs');
const events = require('events');

const server = net.createServer(socket => {
  socket.on('process', data => {
    socket.write(data);
  })
});
server.listen(3000, () => {
  console.log(`listening on 3000`);
});

class Watcher extends events.EventEmitter {
  constructor(watchDir, processedDir) {
    super();
    this.watchDir = watchDir;
    this.processedDir = processedDir;
  }
  watch() {
    fs.readdir(this.watchDir, (err, files) => {
      if (err) throw err;
      for (let index in files) {
        this.emit('process', files[index]);
      }
    })
  }
  start() {
    fs.watchFile(this.watchDir, () => {
      this.watch();
    })
  }
}

const watcher = new Watcher('./watch', './done');

watcher.on('process', (file) => {
  const watchFile = `${watcher.watchDir}/${file}`;
  const processedFile = `${watcher.processedDir}/${file.toLowerCase()}`;
  fs.rename(watchFile, processedFile, err => {
    if (err) throw err;
  })
});

watcher.start();

module.exports = Watcher;




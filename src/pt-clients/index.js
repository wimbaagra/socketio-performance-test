const { io } = require('socket.io-client');
const fs = require('fs');
const readline = require('readline');
const bunyan = require('bunyan');
const timestamp = new Date().getTime();
const connectionLog = bunyan.createLogger({
  name: `socket-pt`,
  streams: [
    {
      level: 'info',
      path: `${__dirname}/logs/connection/connection-${timestamp}.log`
    }
  ]
});
const transimissionLog = bunyan.createLogger({
  name: `socket-pt`,
  streams: [
    {
      level: 'info',
      path: `${__dirname}/logs/transmission/transmission-${timestamp}.log`
    }
  ]
});

// const URL = 'https://ms-socket-jenius2-sit.ecommchannels.com/';
const URL = 'https://nginx-socket-jenius2-sit.ecommchannels.com/';
// const URL = 'https://nginx-socket-socket-inflight-qr-jenius2-sit.apps.ms-bm.dev.corp.btpn.co.id';
// const URL = 'https://ms-socket-socket-inflight-qr-jenius2-sit.apps.ms-bm.dev.corp.btpn.co.id';
// const URL = 'https://socket-test.cloud.btpn.com/';
const path = undefined;
// const URL = 'wss://apidev.btpn.com';
// const path = '/socket/socket.io';
const MAX_CLIENTS = 500;
const CLIENT_CREATION_INTERVAL_IN_MS = 50;

let clientCount = 0;

const cifTokenFile =  `${__dirname}/../../data/cif-token.csv`;

const run = async () => {
  connectionLog.info(`Connection Log for URL: ${URL}, number of users: ${MAX_CLIENTS}`);
  connectionLog.info('==================================================================================');

  
  transimissionLog.info(`Transmission Log for URL: ${URL}, number of users: ${MAX_CLIENTS}`);
  transimissionLog.info('==================================================================================');

  const stream = fs.createReadStream(cifTokenFile);
  const reader = readline.createInterface({ input: stream });

  let firstLine = true;
  let accessToken;

  for await (const line of reader) {
    const data = line.split(',');

    if (firstLine) {
      accessToken = data[0];
      firstLine = false;
    } else {
      if (clientCount >= MAX_CLIENTS) {
        break;
      }

      createClient(accessToken, data[1], data[0]);
      clientCount++;

      await sleep(CLIENT_CREATION_INTERVAL_IN_MS);
    }
  };
};

const createClient = async (accessToken, idToken, cif) => {
  const transports = ['websocket'];
  let connectionAttempt = 1;
  const connectionTime = new Date().getTime();

  const socket = io(URL, {
    path,
    rejectUnauthorized: false,
    transports,
    timeout: 60000,
    extraHeaders: {
      authorization: `Bearer ${accessToken}`,
      'x-id-token': idToken
    }
  });

  socket.on('connect', () => {
    const now = new Date().getTime();
    connectionLog.info(`Connection time: ${cif} +++++${now - connectionTime}#####. Connection attempt: ${connectionAttempt}`)
  });

  socket.on('connect_error', (reason) => {
    connectionAttempt++;
    connectionLog.info(`cif: ${cif} connection error due to ${reason}`);
  });

  socket.on('disconnect', (reason) => {
    connectionAttempt++;
    connectionLog.info(`cif: ${cif} disconnect due to ${reason}`);
  });


  await sleep(10000);

  socket.emit('echo', {
    cif,
    eventName: 'echo',
    data: {
      clientTimestamp: new Date().getTime() 
    }
  });

  socket.on('echo', (msg) => {
    const { clientTimestamp } = msg;
    if (clientTimestamp) {
      const now = new Date().getTime();
      transimissionLog.info(`Transimission time: ${cif} +++++${(now - clientTimestamp) / 2}#####`)
    }
  });
};

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

run();
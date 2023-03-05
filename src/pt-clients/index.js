const { io } = require('socket.io-client');
const fs = require('fs');
const readline = require('readline');
const bunyan = require('bunyan');
const _ = require('lodash');
const percentile = require('percentile');

const {
  URL,
  PATH,
  MAX_CLIENTS,
  CLIENT_CREATION_INTERVAL_IN_MS,
  EMIT_DELAY_TIME_IN_MS,
  CLIENT_TIMEOUT_IN_MS,
  CLIENT_TRANSPORT
} = require('./config');

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

const cifTokenFile =  `${__dirname}/../../data/cif-token.csv`;

let clientCount = 0;
let emittedClientCount = 0;
let connectionTimeResult = [];
let transimssionTimeResult = [];

const run = async () => {
  console.log('Running test scenario... \n')

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
  let connectionAttempt = 1;
  const connectionTime = new Date().getTime();

  const socket = io(URL, {
    path: PATH,
    rejectUnauthorized: false,
    transports: CLIENT_TRANSPORT,
    timeout: CLIENT_TIMEOUT_IN_MS,
    extraHeaders: {
      authorization: `Bearer ${accessToken}`,
      'x-id-token': idToken
    }
  });

  socket.on('connect', () => {
    const now = new Date().getTime();
    const time =  now - connectionTime;

    connectionLog.info(`Connection time: ${cif} +++++${time}#####. Connection attempt: ${connectionAttempt}`)

    connectionTimeResult.push(time);
  });

  socket.on('connect_error', (reason) => {
    connectionAttempt++;
    connectionLog.info(`cif: ${cif} connection error due to ${reason}`);
  });

  socket.on('disconnect', (reason) => {
    connectionAttempt++;
    connectionLog.info(`cif: ${cif} disconnect due to ${reason}`);
  });


  await sleep(EMIT_DELAY_TIME_IN_MS);

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
      const time = now - clientTimestamp;

      transimissionLog.info(`Transimission time: ${cif} +++++${(time) / 2}#####`);

      transimssionTimeResult.push(time);
      emittedClientCount++;

      if(emittedClientCount === MAX_CLIENTS) {
        console.log('Calculating connection time result...');
        calculateResult(connectionTimeResult);

        console.log('Calculating transmission time result...');
        calculateResult(transimssionTimeResult);
      }
    }
  });
};

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const calculateResult = (data) => {
  const max = _.max(data);
  const min = _.min(data);
  const mean = _.mean(data);
  const percentile90 = percentile(90, data);
  const percentile95 = percentile(95, data);
  const percentile99 = percentile(99, data);

  console.log('==============================================')
  console.log(`AVG           : ${mean}`);
  console.log(`MIN           : ${min}`);
  console.log(`MAX           : ${max}`);
  console.log(`90 Percentile : ${percentile90}`);
  console.log(`95 Percentile : ${percentile95}`);
  console.log(`99 Percentile : ${percentile99}`);
  console.log('==============================================\n\n')
};

run();
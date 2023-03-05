module.exports = {
  // ms-socket-ecommchannels = 'https://ms-socket-jenius2-sit.ecommchannels.com/';
  // nginx-socket-ecommchannles = 'https://nginx-socket-jenius2-sit.ecommchannels.com/';
  // nginx-socket-sit = 'https://nginx-socket-socket-inflight-qr-jenius2-sit.apps.ms-bm.dev.corp.btpn.co.id';
  // ms-socket-sit = 'https://ms-socket-socket-inflight-qr-jenius2-sit.apps.ms-bm.dev.corp.btpn.co.id';
  // nginx-socket-prod = 'https://socket-test.cloud.btpn.com/';
  // apigw-external = 'wss://apidev.btpn.com';
  // path-apigw-external = '/socket/socket.io'; 
  URL: 'https://nginx-socket-jenius2-sit.ecommchannels.com',
  // PATH: '/socket/socket.io',
  MAX_CLIENTS: 1000,
  CLIENT_CREATION_INTERVAL_IN_MS: 50,
  EMIT_DELAY_TIME_IN_MS: 5000,
  CLIENT_TRANSPORT: ['websocket'],
  CLIENT_TIMEOUT_IN_MS: 60000
};

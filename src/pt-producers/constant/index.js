const KAFKA_PAYLOAD = {
  cif: '100001',
  eventName: 'echo',
  data: { 
    status: 'SUCCESSFUL',
    amount: '1000',
    merchantName: 'Warkop Siliwangi',
    orderId: 'WS000891823',
    txnId: 'TXN123ID',
    accountNo: '90011216715',
    timestamp: new Date().getTime()
  }
};

const KAFKA_CONFIG = {
  global: {
    clientId: 'socket-sit',
    // brokers: ['10.1.76.102:9093','10.1.76.115:9093','10.1.76.125:9093'],
    brokers: ['10.1.76.85:9093', '10.1.76.86:9093', '10.1.76.88:9093'],
    sasl: {
      mechanism: 'SCRAM-SHA-256',
      // username: 'jenSUProducerUAT',
      // password: 'jenSU20200324'
      username: 'jenSUProducer',
      password: 'jenSUProducer20200210'
    }
  },
  producer: {
    allowAutoTopicCreation: true,
    retry: {
      initialRetryTime: 100,
      retries: 10
    }
  },
  topic: 'ID.JENIUS.SOCKET_EMIT'
};


module.exports = {
  KAFKA_PAYLOAD,
  KAFKA_CONFIG
};

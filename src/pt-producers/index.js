
const { Kafka } = require('kafkajs');
const {
  KAFKA_PAYLOAD,
  KAFKA_CONFIG: {
    global: globalConfig,
    producer: producerConfig,
    topic
  }
} = require('./constant');

const main = async () => {
  const kafka = new Kafka(globalConfig);
  const producer = kafka.producer(producerConfig);
  await producer.connect();

  const MAX_CLIENT = 100;
  let cif = 100001;
  let payload = KAFKA_PAYLOAD;

  console.log('Running scenario ....')
  for(let i=0; i<MAX_CLIENT; i++) {
    payload.cif = cif.toString();
    payload.data.timestamp = new Date().getTime();

    await producer.send({
      topic,
      messages: [
        { value: JSON.stringify(payload) }
      ],
    });
    await producer.send({
      topic,
      messages: [
        { value: JSON.stringify(payload) }
      ],
    });
    await producer.send({
      topic,
      messages: [
        { value: JSON.stringify(payload) }
      ],
    });
    await producer.send({
      topic,
      messages: [
        { value: JSON.stringify(payload) }
      ],
    });
  
    cif++;
  }

  await producer.disconnect();
  
  console.log('Scenario completed')
  return;
}

main();
import React, { useEffect } from 'react';
import { Kafka } from 'kafkajs';



const MyComponent = () => {
 

  useEffect(() => {
    const kafka = new Kafka({
      clientId: 'my-app',
      brokers: ['localhost:9092']
    });
  
    const producer = kafka.producer();
  
    const sendMessage = async () => {
      await producer.connect();
      await producer.send({
        topic: 'topic-test',
        messages: [{
          key: '1',
          value: 'Hello Kafka!'
        }]
      });
    };
    sendMessage();
  }, []);

  return <div>Hello Kafka!</div>;
};

export default MyComponent;

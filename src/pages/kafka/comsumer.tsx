
import { Kafka, logLevel }from 'kafkajs';

const host = process.env.HOST_IP || 'localhost'

const kafka = new Kafka({
  logLevel: logLevel.INFO,
  brokers: [`localhost:9092`],
  clientId: 'example-consumer',
})

const topic = 'topic-test'
const consumer = kafka.consumer({ groupId: 'test-group' })

export const runConsumer = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: true })
  // await consumer.run({
   
  //   eachMessage: async ({ topic, partition, message }) => {
  //     const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
  //     console.log(`- ${prefix} ${message.key}#${message.value}`)
  //   },
  // })
}
const express = require('express')
const app = express()
const port = 3000
var cors = require('cors');
const { Kafka, CompressionTypes, logLevel } = require('kafkajs');
const { keyBy } = require('lodash');


app.use(cors({
    origin: 'https://8000-pho2345-managerhr-7q9jxcdcpi2.ws-us110.gitpod.io',
    optionsSuccessStatus: 200
}));

const kafka = new Kafka({
    logLevel: logLevel.DEBUG,
    brokers: [`localhost:9092`],
    clientId: 'example-producer',
})

app.get('/', async(req, res) => {
    const topic = 'topic-test'
    const producer = kafka.producer();
    await producer.connect()
    producer
        .send({
            topic,
            compression: CompressionTypes.GZIP,
            messages: [{
                key: '123',
                value: 'photra'
            }],
        })
        .then(console.log)
        .catch(e => console.error(`[example/producer] ${e.message}`, e))
    res.send('Hello World!')
})

app.get('/hello', async(req, res) => {
    const topic = 'topic-test';
    console.log('topic', topic)
    const consumer = kafka.consumer({ groupId: 'test-group' })
    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning: true })
    await consumer.run({
        // eachBatch: async ({ batch }) => {
        //   console.log(batch)
        // },
        eachMessage: async({ topic, partition, message }) => {
            const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
            console.log(`- ${prefix} ${message.key}#${message.value.toString()}`)
        },
    })
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
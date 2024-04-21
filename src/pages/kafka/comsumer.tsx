import { Kafka } from "@upstash/kafka"

export const runConsumer = async () => {
  const kafka = new Kafka({
    url: "https://gentle-sailfish-8380-us1-rest-kafka.upstash.io",
    username: "Z2VudGxlLXNhaWxmaXNoLTgzODAk84ZVjyNVR2-tTFIKwjyJ5PZO01DCRkEETOc",
    password: "NWM3ODc1OTQtZjJlYS00NGUwLTlkMWMtYmY4ZmVhMTg0OTgy",
  })
  
  const c = kafka.consumer()
  
  const messages = await c.consume({
    consumerGroupId: "group_1",
    instanceId: "instance_1",
    topics: ["khen-thuong"],
    autoOffsetReset: "earliest",
  });

  console.log(messages);
}
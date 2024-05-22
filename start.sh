cd kafka
KAFKA_CLUSTER_ID="$(bin/kafka-storage.sh random-uuid)"
bin/kafka-storage.sh format -t $KAFKA_CLUSTER_ID -c config/kraft/server.properties
bin/kafka-server-start.sh config/kraft/server.properties

kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic fbi --from-beginning --consumer.config sasl 
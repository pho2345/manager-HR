cd kafka
KAFKA_CLUSTER_ID="$(bin/kafka-storage.sh random-uuid)"
bin/kafka-storage.sh format -t $KAFKA_CLUSTER_ID -c config/kraft/server.properties
bin/kafka-server-start.sh config/kraft/server.properties

kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic fbi --from-beginning --consumer.config sasl 

bin/kafka-storage.sh format -t "bc2NFnG-TbKqe4jK7sldCQ" -c config/kraft/server1_sasl.properties
bin/kafka-storage.sh format -t "bc2NFnG-TbKqe4jK7sldCQ" -c config/kraft/server2_sasl.properties
bin/kafka-storage.sh format -t "bc2NFnG-TbKqe4jK7sldCQ" -c config/kraft/server3_sasl.properties

bin/kafka-server-start.sh config/kraft/server1_sasl.properties
bin/kafka-server-start.sh config/kraft/server2_sasl.properties
bin/kafka-server-start.sh config/kraft/server3_sasl.properties

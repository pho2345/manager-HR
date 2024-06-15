#!/bin/bash

# Generate Kafka Cluster ID
KAFKA_CLUSTER_ID="$(kafka/bin/kafka-storage.sh random-uuid)"

# Format the storage directory
kafka/bin/kafka-storage.sh format -t $KAFKA_CLUSTER_ID -c kafka/config/kraft/server.properties

# Start Kafka broker
kafka/bin/kafka-server-start.sh kafka/config/kraft/server.properties &

# Start Kafka Connect
kafka/bin/connect-distributed.sh kafka/config/connect-distributed.properties &

# Start Kafka REST Proxy
kafka/share/rest-proxy/bin/kafka-rest-start kafka/share/rest-proxy/etc/kafka-rest/kafka-rest.properties &

# Start Schema Registry
kafka/share/schema-registry/bin/schema-registry-start kafka/share/schema-registry/etc/schema-registry/schema-registry.properties &

# Start KSQL
kafka/share/ksql/bin/ksql-server-start kafka/share/ksql/etc/ksqldb/ksql-server.properties &

# Wait for all background processes to finish
wait

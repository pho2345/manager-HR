kafka/bin/kafka-topics.sh --list --bootstrap-server localhost:9092 --command-config kafka/sasl.properties

#start connectors
kafka/bin/connect-distributed.sh kafka/config/connect-distributed.properties

#start proxy
kafka/share/rest-proxy/bin/kafka-rest-start kafka/share/rest-proxy/etc/kafka-rest/kafka-rest.properties

#start schema registry
kafka/share/schema-registry/bin/schema-registry-start kafka/share/schema-registry/etc/schema-registry/schema-registry.properties

#start ksql
kafka/share/ksql/bin/ksql-server-start kafka/share/ksql/etc/ksqldb/ksql-server.properties

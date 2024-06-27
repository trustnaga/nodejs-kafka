const { Kafka, logLevel } = require("kafkajs")

const clientId = "my-app"

const brokers = ["ngdemo.servicebus.windows.net:9093"]
const topic = "test"

const kafka = new Kafka({ 
	clientId, 
	brokers, 
	logLevel: logLevel.DEBUG,
	ssl: true,
	sasl: {
		mechanism: 'plain', // scram-sha-256 or scram-sha-512
		username: '$ConnectionString',
		password: 'Endpoint=sb://ngdemo.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=xxxx='
	},
	
})

// the kafka instance and configuration variables are the same as before

// create a new consumer from the kafka client, and set its group ID
// the group ID helps Kafka keep track of the messages that this client
// is yet to receive
const consumer = kafka.consumer({
	groupId: clientId,
	minBytes: 5,
	maxBytes: 1e6,
	// wait for at most 3 seconds before receiving new data
	maxWaitTimeInMs: 3000,
})

const consume = async () => {
	// first, we wait for the client to connect and subscribe to the given topic
	await consumer.connect()
	await consumer.subscribe({ topic, fromBeginning: true })
	await consumer.run({
		// this function is called every time the consumer gets a new message
		eachMessage: ({ message }) => {
			// here, we just log the message to the standard output
			console.log(`received message: ${message.value}`)
		},
	})
}

consume().catch((err) => {
	console.error("error in consumer: ", err)
})

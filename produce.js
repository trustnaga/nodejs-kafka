// import the `Kafka` instance from the kafkajs library
const { Kafka, logLevel } = require("kafkajs")

// the client ID lets kafka know who's producing the messages
const clientId = "my-app"
// we can define the list of brokers in the cluster
const brokers = ["ngdemo.servicebus.windows.net:9093"]
// this is the topic to which we want to write messages
const topic = "test"

// initialize a new kafka client and initialize a producer from it
const kafka = new Kafka({ 
		clientId, 
		brokers, 
		// logLevel: logLevel.DEBUG,
		ssl: true,
		sasl: {
			mechanism: 'plain', // scram-sha-256 or scram-sha-512
			username: '$ConnectionString',
			password: 'Endpoint=sb://ngdemo.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=xxxx'
		},
		
 }) 
const producer = kafka.producer({})

// we define an async function that writes a new message each second
const produce = async () => {
	await producer.connect()
	let i = 0

	// after the produce has connected, we start an interval timer
	setInterval(async () => {
		try {
			// send a message to the configured topic with
			// the key and value formed from the current value of `i`
			await producer.send({
				topic,
				acks: 1,
				messages: [
					{
						key: String(i),
						value: "this is message " + i,
					},
				],
			})

			// if the message is written successfully, log it and increment `i`
			console.log("writes: ", i)
			i++
		} catch (err) {
			console.error("could not write message " + err)
		}
	}, 1000)
}

// module.exports = produce

produce().catch((err) => {
	console.error("error in producer: ", err)
})

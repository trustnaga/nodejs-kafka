const { Kafka, logLevel } = require("kafkajs")

const clientId = "my-app"

const brokers = ["ngdemo.servicebus.windows.net:9093"]
const topic = "test"

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

// the kafka instance and configuration variables are the same as before

// create a new consumer from the kafka client, and set its group ID
// the group ID helps Kafka keep track of the messages that this client
// is yet to receive


const admin = async () => {
	const admin = kafka.admin()
    await admin.connect()
   
    // add a setinterval with a timeout of 5 seconds and break after 20 iterations
  
    await admin.listGroups().then((res) => {
        console.log("groups: ", res)
    })
    await admin.describeGroups([ 'my-app' ]).then((res) => {
        console.log("groups: ", res)
    })
 
  
    await admin.disconnect()
}

admin().catch((err) => {
	console.error("error in consumer: ", err)
})

const { MongoClient } = require("mongodb");

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lklnw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
	try {
		await client.connect();
		console.log('database connected');

		const database = client.db('volunter_network');
		const eventCollection = database.collection('events');
		const volunteerList = database.collection('volunteer');

		//get api

		app.get('/events', async(req, res) => {
			const cursor = eventCollection.find({});
			const events = await cursor.toArray();

			res.send(events);
		})



		//post api

		app.post('/events', async (req, res) => {
            const event = req.body;
            console.log('hit the post api', event);

            const result = await eventCollection.insertOne(event);
            console.log(result);
            res.json(result)
        });

		app.post('/volunteer', async (req, res) => {
            const volunteer = req.body;
            console.log('hit the post api', volunteer);

            const result = await volunteerList.insertOne(volunteer);
            console.log(result);
            res.json(result)
        });

	}
	finally {
		//await client.close();
	}
}

run().catch(console.dir);

app.get('/', (req, res) => {
	res.send('Running server...');
})

app.listen(port, () => {
	console.log('Running on port',port);
})
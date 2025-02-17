const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000


// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jrpw9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db("coffeeDB").collection("coffees");

    // Read many DATA
    app.get('/coffee', async (req, res) => {
       const cursor = coffeeCollection.find()
       const coffees = await cursor.toArray()
       res.send(coffees)
    })

    // Read single DATA
    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id
      const coffee = { _id: new ObjectId(id) }
      const result = await coffeeCollection.findOne(coffee)
      res.send(result)
    })


    // Create DATA  
    app.post('/coffee', async (req, res) => {
        const coffee = req.body;
        console.log(coffee, "new coffee")
        const result = await coffeeCollection.insertOne(coffee);
        res.send(result)
    })


    // Update DATA
    app.put( '/coffee/:id', async (req, res) => {
      const id = req.params.id
      const filter = {_id : new ObjectId(id)}
      const options = { upsert: true }
      const updateCoffee = req.body
      const coffee = {
        $set: {
           name     : updateCoffee.name,
           price    : updateCoffee.price,
           photo    : updateCoffee.photo,
           Quantity : updateCoffee.Quantity,  
           supplier : updateCoffee.supplier,
           taste    : updateCoffee.taste,
           category : updateCoffee.category,
        }
      }
      const result = await coffeeCollection.updateOne(filter, coffee, options)
      res.send(result)
    })

    // Delete DATA
     app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
     })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Coffee server is welcoming')
})


app.listen(port, () => {
    console.log(`Coffee Server is running on port ${port}`)
})
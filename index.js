const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { Database } = require("mongo");
//middleware
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("hello World");
});
require("dotenv").config();
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.icavc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    const db = client.db("CoffeeDB");
    const coffees = db.collection("coffees");
    app.get("/", (req, res) => {
      res.send("HOT HOT HOT COFFEE");
    });
    app.post("/coffee", async (req, res) => {
      const doc = req.body;
      const result = await coffees.insertOne(doc);
      res.send(result);
      console.log(`documents were inserted with the _id: ${result.insertedId}`);
    });
    app.get("/coffee", async (req, res) => {
      const cursor = coffees.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await coffees.deleteOne(query);
      res.send(result);
    });
    app.get("/coffee/:id", async (req, res) => {
      const id = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await coffees.findOne(query);
      res.send(result);
    });
    app.put("/update_a_coffee/:id", async (req, res) => {
      const id = req.params;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const data = req.body;
      const updatedCoffee = {
        $set: {
          coffeeName: data.updated_coffeeName,
          chef: data.updated_chef,
          supplier: data.updated_supplier,
          taste: data.updated_taste,
          category: data.updated_category,
          details: data.updated_details,
          photo: data.updated_photo,
        },
      };
      const result = await coffees.updateOne(filter, updatedCoffee, options);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(5000, () => {
  console.log("Listening to port 5000");
});

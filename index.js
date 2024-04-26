const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

// arifraj9911
// VDnqCNcFl6oRQkfG

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ijf4taw.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);

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

    const touristSpotCollection = client
      .db("dbTouristSpot")
      .collection("touristSpot");

    app.get("/tourist-spots", async (req, res) => {
      const result = await touristSpotCollection.find().toArray();
      res.send(result);
    });
    app.get("/my-list", async (req, res) => {
      const result = await touristSpotCollection.find().toArray();
      res.send(result);
    });

    app.get("/tourist-spots/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.findOne(query);
      res.send(result);
    });

    app.get("/my-list/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email);
      const query = { email: email };
      const result = await touristSpotCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/tourist-spots", async (req, res) => {
      const touristSpots = req.body;
      const result = await touristSpotCollection.insertOne(touristSpots);
      res.send(result);
    });

    app.put("/my-list/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const touristSpot = req.body;
      const options = { upsert: true };
      const updateTouristSpot = {
        $set: {
          spot_name: touristSpot.spot_name,
          image: touristSpot.image,
          country_name: touristSpot.country_name,
          location: touristSpot.location,
          avg_cost: touristSpot.avg_cost,
          travel_time: touristSpot.travel_time,
          visitor: touristSpot.visitor,
          description: touristSpot.description,
        },
      };
      const result = await touristSpotCollection.updateOne(
        filter,
        updateTouristSpot,
        options
      );
      res.send(result);
    });

    app.delete("/my-list/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Tourism management server is running");
});

app.listen(port, () => {
  console.log(`Tourism server is running on port ${port}`);
});

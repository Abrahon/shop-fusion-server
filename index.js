const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json())




const uri = "mongodb+srv://shopFusion:IhvhS0zFXT4m8d7V@cluster0.0xcir2l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();

    const productCollection =  client.db("shopDb").collection("products");
    const cartCollection =  client.db("shopDb").collection("carts");

    app.get('/products', async(req,res)=>{
        const result = await productCollection.find().toArray();
        res.send(result)
    })

    app.get('/products/:id', async(req, res)=>{
        const id = req.params.id;
        console.log(id)
        const query = {_id:new ObjectId(id)}
        const product = await productCollection.findOne(query)
        res.send(product);
    })
    app.get('/carts',async(req,res)=>{
        const result = await cartCollection.find().toArray();
        res.send(result)
    })
    
    // cart
    app.post('/carts', async (req, res) => {
        const item = req.body;
        const result = await cartCollection.insertOne(item);
        res.send(result);
      });

    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })
  } finally {
   
  }
}
run().catch(console.dir);


app.get('/',(req, res)=>{
    res.send('shop fusion is running')
});

app.listen(port, ()=>{
    console.log(`listening to the ${port}`)
})


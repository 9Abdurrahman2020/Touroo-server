const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

// mongodb connection uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y7ez2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function server(){
    try{
        await client.connect();
        const database = client.db('tooroo');
        const tripCollection = database.collection('trips');
        const bookingCollection = database.collection('booking');
        // get api
        app.get('/trips', async(req,res)=>{
            const result = await tripCollection.find({}).toArray();
            res.json(result);
        })
        // load single data
        app.get('/single-trip/:id', async(req,res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await tripCollection.findOne(query)
            res.json(result);
        })
        // post bookings
        app.post('/bookings', async(req,res)=>{
            const data = req.body;
            const result = await bookingCollection.insertOne(data)
            res.json(result)
        })
        // get api(specific user bookings)
        app.get('/my-bookings/:email', async(req,res)=>{
            const email = req.params.email;
            const query = { email: email}
            const count = await bookingCollection.count(query);
            const result = await bookingCollection.find(query).toArray();
            res.json({count,result})
        })
        // delete api (delete a booking)
        app.delete('/delete/:id', async(req,res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bookingCollection.deleteOne(query);
            res.json(result)
        })
        // post trip
        app.post('/addTrip', async(req,res)=>{
            const newTrip = req.body;
            const result = await tripCollection.insertOne(newTrip);
            res.json(result)
        })
        // get all bookings
        app.get('/all-bookings', async(req,res)=>{
            const result = await bookingCollection.find({}).toArray()
            res.json(result)
        })
        // update api (update a booking status)
        app.put('/update/:id', async(req,res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const updateStatus ={
                $set:{
                    status:"approved"
                }
            }
            const result = await bookingCollection.updateOne(query,updateStatus)
            res.json(result)
        })
    }
    finally{
        // await client.close()
    }

}
server().catch(console.dir)



app.get('/', (req,res)=>{
    res.send('Assignment-11 node server is running on heroku')
})
app.listen(port , ()=>{
    console.log('Server is running on port: ', port);
})

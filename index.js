const express = require('express')
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000 ;
const cors = require('cors')
const ObjectId = require('mongodb').ObjectID;

// middleware
app.use(cors())
app.use(express.json())
const { MongoClient } = require('mongodb');
const { ObjectID } = require('bson');


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hyeto.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run(){
      try{
         await client.connect();
         console.log('database connected successfully');

         const database = client.db('Flyways_Travel_Blog')

         const serviceCollection = database.collection('services')
         const orderCollection = database.collection('Orders')
         const reviewCollection = database.collection('reviews')
         const usersCollection = database.collection('users')
         const blogsCollection = database.collection('blogs')

         app.get('/services', async (req, res)=>{
             const result =  serviceCollection.find({});
             const services = await result.toArray();

             res.json(services)
         })

         app.post('/services', async(req, res)=>{
             const services = req.body;
             const result = await serviceCollection.insertOne(product)
             res.json(result)
         })

         app.get('/services/:id', async (req, res)=>{
             const id = req.params.id;
             const query = {_id: ObjectId(id)}
             const result = await serviceCollection.findOne(query)
             res.json(result)
         })

         app.delete('/services/:id' , async (req, res)=>{
             const id = req.params.id;
             const query = {_id : ObjectID(id)};
             const result = await serviceCollection.deleteOne(query)
             res.json(result)
         })

         app.post('/orders', async(req, res)=>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result )
        })
        app.get('/orders', async (req, res)=>{
            const result = orderCollection.find({});
            const orders = await result.toArray();
            res.send(orders)
        }) 

       app.get('/orders/:email', async (req, res) =>{
           const email = req.params.email;
           const query = {email} ;
           console.log(query)
           const cursor =  orderCollection.find(query)
           const result = await cursor.toArray();
           res.json(result)
       } ) 

       app.get('/order/:id', async(req, res)=>{
           const id = req.params.id;
           const query = {_id: ObjectID(id)}
           const result = await orderCollection.findOne(query)
           res.json(result)
       })
       app.get('/reviews', async(req, res)=>{
           const result =  reviewCollection.find({});
           const reviews = await result.toArray();
           res.json(reviews)
       }) 
       app.post('/reviews' , async(req, res)=>{
           const cursor = req.body;
           const result = await reviewCollection.insertOne(cursor)
           res.json(result)
       })

       app.delete('/order/:id', async (req, res)=>{
           const id = req.params.id;
           const query = {_id: ObjectID(id)};
           const result = await orderCollection.deleteOne(query)
           res.json(result)
       })  
      
      //  =============================================

    //   app.post('/users', async(req, res)=>{
    //     const cursor = req.body;
    //     const user = await usersCollection.insertOne(cursor)
    //     res.json(user)

    // })

    app.get('/users', async ( req, res) =>{
        const cursor = usersCollection.find({});
        const result = await cursor.toArray();
        res.json(result)

    }) 

    // app.get('/users/:email', async (req, res) =>{
    //     let isAdmin = false;
    //     const email = req.params.email;
    //     const query = {email: email}
    //     const result = await usersCollection.findOne(query)
    //     if(result?.role)
    //     {
    //         isAdmin = true;
    //     }
        
    //     res.json({admin: isAdmin})
    // })
    // app.put('/users', async ( req, res) =>{
    //     const user = req.body;
    //     console.log(user)
    //     const filter = {email: user.email}
    //     const options = { upsert : true}
    //     const updateDoc = {$set: user};
    //     const result = await usersCollection.updateOne(filter, updateDoc, options);
    //     res.json(result)

    // }) 

    // app.put('/users/admin', async ( req, res) =>{
    //     const user = req.body;
    //     const filter = {email: user.email}
    //     const updateDoc = {$set:{ role:"admin"}}
    //     const result = await usersCollection.updateOne(filter, updateDoc)
    //     res.json(result)

    // })

      //  =======================================
      // admin user get
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
        isAdmin = true;
      }
      res.json({ admin: isAdmin })
    })



    // users post
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });



    // put user
    app.put('/users', async (req, res) => {
      const user = req.body;
      // console.log('put', user);
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    })


    // users admin put
    app.put('/users/admin', async (req, res) => {
      const user = req.body;
      console.log('put', user);
      const filter = { email: user.email };
      const updateDoc = { $set: { role: 'admin' } }
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    })


       app.put('/orders/:id', async(req, res)=>{
           const id = req.params.id;
           const filter = {_id : ObjectID(id)}
           const updateDoc = {$set: {status : 'shipped'}}
           const result = await orderCollection.updateOne(filter, updateDoc)
           res.json(result)
       })


      //  blog
       app.post('/blogs', async(req, res )=>{
        const title = req.body.title;
        const author = req.body.author;
        const description = req.body.description;
        const status = req.body.status;
        const authorEmail = req.body.email;
        const pic = req.files.image;
        const picData = pic.data;
        const encodedPic = picData.toString('base64')
        const image = Buffer.from(encodedPic, 'base64');
        
         const blogs = {
           
            title,authorEmail, description, author, status, image,
         }

         const result  = await blogsCollection.insertOne(blogs)
         res.json(result)
      }) 



      app.get('/blog/:id', async(req, res) => {
        const id = req.params;
        const filter = { _id : ObjectId(id)};
        const query = await blogsCollection.findOne(filter)
        res.json(query)
      })

      app.put('/blog/:id', async(req, res) =>{
        const id = req.params;
        const filter = { _id : ObjectId(id)};
        const updateDoc = { $set : {status: 'active'} }
        const result = await blogsCollection.updateOne(filter, updateDoc)
        res.json(result)
      })

      

      app.delete('/blog/:id', async(req, res)=>{
        const id = req.params;
        const filter = { _id : ObjectId(id)};
        const query = await blogsCollection.deleteOne(filter)
        res.json(query)
      })

      app.get('/blogs/:email', async(req, res) =>{

        const author = req.params;
        
        const filter = { authorEmail : author.email}
        console.log(filter)
        const query = blogsCollection.find(filter)
        const result = await query.toArray()
        res.json(result)

     })

      app.get('/blogs', async(req, res)=>{
          const blogs =  blogsCollection.find({});
          const result = await blogs.toArray();
          res.json(result)
      })

     
      } 
      
      finally{
        //  await client.close();
      }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send("Flyways travel Server is Running")
})

app.listen(port, ()=>{
    console.log("Listening From", port)
} )
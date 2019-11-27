
const express = require('express');
const app = express();


const server = require('http').createServer(app);
const io = require('socket.io')(server);
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/mydb";


MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  let dbo = db.db("mydb");
  dbo.createCollection("customers", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});
//disable in local development
io.origins(['https://me.teachmeapp.me:443']);

let allMassage = { author: 'From admin', message: "Den här chatten skapades i nov 2019", timestamp: '2019-11-16 20:04:06'};
insertIntoCollection(url, "customers", allMassage)

io.on('connection', (socket) => {
    console.log(socket.id);

    (() => {
    findInCollection(url, "customers", {}, {}, 0)
    .then(res => { socket.emit('RECEIVE_MESSAGE_OLD', res);
    console.log(res)})
    .catch(err => console.log(err));
    })();
    // socket.emit('RECEIVE_MESSAGE_OLD', allMassage);

    // console.log(allMassage);
    socket.on('SEND_MESSAGE', function(data){
        io.emit('RECEIVE_MESSAGE', data);
        // allMassage.push(data);
        insertIntoCollection(url, "customers", data)
            .catch(err => console.log(err));
    })

});

server.listen(5000);

async function findInCollection(url, colName, criteria, projection, limit) {
    const client  = await MongoClient.connect(url);
    const db = await client.db();
    const col = await db.collection(colName);
    const res = await col.find(criteria, projection).limit(limit).toArray();

    await client.close();

    return res;
}

async function insertIntoCollection(url, colName, doc) {
    const client  = await MongoClient.connect(url);
    const db = await client.db();
    const col = await db.collection(colName);


    await col.insertOne(doc);
    // await col.deleteMany();

    await client.close();
}

const MongoClient = require('mongodb').MongoClient;
var express = require('express');
var mongodb = require('mongodb');
var app = express();
var bodyParser = require('body-parser');
var async = require('async');

var cors = require('cors');

app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(9090, function () {
  console.log('server running at http://localhost:9090');
});

const url = "mongodb://localhost:27017/";
var dbName = 'project';
var db = null;

// Connection with MongoDb
MongoClient.connect(url, function (err, client) {
  if (err) {
    console.log("Error while connecting to mongo. Make sure mongodb is running");
  } else {
    console.log("Successfully connected to MongoDB!!");
    db = client.db(dbName);
  }
});


// 'Replace / with /<collections_name>'
// app.get('/mycollection', function (req, res) {
//   console.log("Inside GET / ");
//   if(db != null) {
//    db.collection("mycollection").find({}).toArray(function(err, result) {
//       if (err) throw err;
//       console.log(result);
//       res.send(result);
//       var myobj = {first_name : "king"};
//       db.collection("mycollection").insertOne({}, function(err, res) {
//         if (err) throw err;
//         console.log("1 Document inserted");

//       });
//   })
// } 
// });



// app.post('/mycustomers', function(req,res){
//   if(db != null)
//   {
//     var myobj = req.body;
// 	console.log(JSON.stringify(myobj));
//      db.collection("customers").insertOne(myobj, function(err,result){
//        if(err) throw err;
//        console.log("Documents inserted");
// 	    console.log(JSON.stringify(result)); 

//        res.send(result);
//       })
app.get('/', function (req, res) {
  console.log("Inside GET / ");
  if (db != null) {
    async.waterfall({
      function(callback) {
        db.collection("customers").find({ first_name: "Dhiraj" }).toArray(function (err, result) {
          if (err) throw err;
          callback(err, null)
          console.log("1 document found");
          
          
          if (result == null) {
            var myobj = { first_name: "Dhiraj", last_name: "Kumar" };
            db.collection("customers").insertOne(myobj, function (err, rest) {
              if (err) throw err;
              console.log("1 document inserted");
              callback(null,result,rest);
            }
            )
          }
        })
      },
      function(result,rest,callback){
        console.log(result); 
        console.log(rest);
        callback(null);
      }




    })
  }
})

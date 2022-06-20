//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
var email = "";
var passwordMain ="";
var mongoose = require("mongoose");
var encrypt = require("mongoose-encryption");
const { MongoClient } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
const client = new MongoClient(process.env.API_URL);

mongoose.connect(process.env.API_URL , {useNewUrlParser: true});

const userSchema= new mongoose.Schema({
  email:String,
  password: String});


userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields:["password"]});


const User = new mongoose.model("Users",userSchema);


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
//mongoose.connect("mongodb+srv://dade11dado:NazBr7VNlIxJeDQJ@cluster0.et3op.mongodb.net/?retryWrites=true&w=majority");






app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  email = req.body.username;
  password = req.body.password;

  const newUser = new User({
    email:email,
    password:password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  })
  /*async function run() {
    try {
      await client.connect();
      const database = client.db('myFirstDatabase');
      const movies = database.collection('users');
      // Query for a movie that has the title 'Back to the Future'
      const query = { _id: 1 };
      const user = await movies.insertOne({name:email,password:password});
      res.render("secrets");
      console.log(user);
    } finally {

      await client.close();
    }
  }
  run().catch(console.dir);*/

})

app.post("/login", function(req, res){
  const usernameLogin = req.body.username;
  console.log(usernameLogin);
  const passwordLogin = req.body.password;
  console.log(passwordLogin);

  User.findOne({email:usernameLogin}, function(err, foundUser){
    if (err){
      console.log(err);
    }else{
      if (foundUser.password === passwordLogin){
        res.render("secrets")
      }else{
        res.send("<h1>Non puoi accedere con queste credenziali</h1>");
      }
    };

  });
  /*async function run() {
    try {
      await client.connect();
      const database = client.db('myFirstDatabase');
      const movies = database.collection('users');
      // Query for a movie that has the title 'Back to the Future'
      const query = {name:usernameLogin};
      const user = await movies.findOne(query);
      if (user.password === passwordLogin){
        res.render("secrets");
      }else{
        res.send("<h1>Password o username errati</h1>");
      }
    } finally {

      await client.close();
    }
  }
  run().catch(console.dir);*/

});




app.listen(3000, function(){
  console.log("Connesso");
})

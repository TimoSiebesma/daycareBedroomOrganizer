const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");
var bcrypt = require("bcryptjs");

const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(express.static(path.join(__dirname, "client/build")));

const port = process.env.PORT || 5000;

app.post("/createUserInformation", async (req, res) => {
  console.log("ok");
  const uri = "";
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const cl = await client.connect();

  try {
    let userInformation = await cl
      .db("TimoProjects")
      .collection("daycare-bedroom-organizer")
      .findOne({ username: req.body.username });

    if (req.body.password1 !== req.body.password2) {
      await res.json("Passwords don't match");
    } else if (userInformation) {
      await res.json("User already exists, pick another username");
    } else {
      bcrypt.genSalt(10, async (err, salt) => {
        bcrypt.hash(req.body.password1, salt, async (err, hash) => {
          let newUser = {
            username: req.body.username,
            password: hash,
            children: [],
            bedrooms: []
          };

          try {
            await cl.db("TimoProjects").collection("daycare-bedroom-organizer").insertOne(newUser);
            await res.json("succes");
            await cl.close();
          } catch (err) {
            console.log(err);
          }
        });
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/getLoginInformation", async (req, res) => {
  const uri = "";
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const cl = await client.connect();

  try {
    let userInformation = await cl
      .db("TimoProjects")
      .collection("daycare-bedroom-organizer")
      .findOne({ username: req.body.username });

    if (!userInformation) {
      res.json("Username does not exist");
    }

    bcrypt.compare(req.body.password, userInformation.password).then(resp => {
      if (resp) {
        res.json(userInformation);
      } else {
        res.json("Wrong password");
      }
    });
  } catch (err) {
    console.log(err);
  } finally {
    await cl.close();
  }
});

app.post("/updateUser", async (req, res) => {
  const uri = "";
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const cl = await client.connect();
  try {
    let collection = await cl.db("TimoProjects").collection("daycare-bedroom-organizer");

    await collection.updateMany(
      { username: req.body.username },
      { $set: { bedrooms: req.body.bedrooms, children: req.body.children } },
      { upsert: true }
    );

    let newData = await collection.findOne({ username: req.body.username });
    res.json(newData);
  } catch (err) {
    console.log(err);
  } finally {
    await cl.close();
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.listen(port);

console.log("App is listening on port " + port);

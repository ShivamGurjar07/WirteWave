const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const app = express();
const User = require("./models/user");

app.use(cors());
app.use(express.json());
mongoose.connect(
  "mongodb+srv://wirteWave:go7DYB7lXDh9K4bU@cluster0.xct6t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({ username, password });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});
app.listen(8080);

// go7DYB7lXDh9K4bU
// mongodb+srv://wirteWave:go7DYB7lXDh9K4bU@cluster0.xct6t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

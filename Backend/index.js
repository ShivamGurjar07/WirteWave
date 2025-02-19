const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const User = require("./models/user");
const Post = require("./models/post");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const uploadMiddleWare = multer({ dest: "uploads/" });
const salt = bcrypt.genSaltSync(10);
const secret = "sadsdncdndvndkl579";
const fs = require("fs");
const path = require("path");
require('dotenv').config();
const PORT = process.env.PORT; 

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));


async function connectDB() {
  try {
    await mongoose.connect(process.env.url);
    console.log("mongodb is connected");
  } catch (error) {
    console.log("error", error);
  }
}


// User Registration
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

// User Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userDoc = await User.findOne({ username });

    if (!userDoc) {
      return res.status(400).json({ error: "User not found" });
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (!passOk) {
      return res.status(400).json({ error: "Wrong credentials" });
    }

    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) {
        return res.status(500).json({ error: "Error generating token" });
      }

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
        })
        .json({
          id: userDoc._id,
          username,
        });
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/profile", (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    res.json(info);
  });
});

// Logout
app.post("/logout", (req, res) => {
  res
    .cookie("token", "", { httpOnly: true, secure: false, sameSite: "lax" })
    .json({ message: "Logged out" });
});

app.post("/post", uploadMiddleWare.single("file"), async (req, res) => {
  try {
    const { originalname, path: tempPath } = req.file;
    const ext = path.extname(originalname);
    const newPath = `${tempPath}${ext}`;

    fs.renameSync(tempPath, newPath);

    const { title, summary, content } = req.body;
    const token = req.cookies?.token;

    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        return res.status(403).json({ error: "Invalid token" });
      }
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id,
      });

      res.json({ postDoc });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating post" });
  }
});

app.put("/post", uploadMiddleWare.single("file"), async (req, res) => {
  let newPath = null;

  if (req.file) {
    const { originalname, path: tempPath } = req.file;
    const ext = path.extname(originalname);
    newPath = `${tempPath}${ext}`;
    fs.renameSync(tempPath, newPath);
  }

  const token = req.cookies?.token;

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    const { id, title, summary, content } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    try {
      const postDoc = await Post.findById(id);
      if (!postDoc) {
        return res.status(404).json({ error: "Post not found" });
      }

      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(403).json({ error: "You are not the author" });
      }

      postDoc.set({
        title,
        summary,
        content,
        cover: newPath || postDoc.cover,
      });

      await postDoc.save();
      res.json(postDoc);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

app.get("/post", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

app.listen(PORT, async() => {
   await connectDB()
  console.log("Server running on http://localhost:8080");
  
});

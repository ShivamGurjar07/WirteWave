const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const User = require("./models/user");
const Post = require("./models/post");
const Comment = require("./models/comment");

const jwt = require("jsonwebtoken");
const multer = require("multer");
const uploadMiddleWare = multer({ dest: "uploads/" });
const salt = bcrypt.genSaltSync(10);
const secret = "sadsdncdndvndkl579";
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const PORT = process.env.PORT;
app.use(cors());
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

// app.post("/comment", async (req, res) => {
//   const token = req.cookies?.token;
//   if (!token) return res.status(401).json({ error: "Not authenticated" });

//   jwt.verify(token, secret, {}, async (err, user) => {
//     if (err) return res.status(403).json({ error: "Invalid token" });

//     const { postId, text } = req.body;
//     try {
//       const newComment = await Comment.create({
//         postId,
//         userId: user.id,
//         username: user.username,
//         text,
//       });
//       res.json(newComment);
//     } catch (error) {
//       res.status(500).json({ error: "Error adding comment" });
//     }
//   });
// });

// //  Get Comments for a Post
// app.get("/comment/:postId", async (req, res) => {
//   const { postId } = req.params;
//   try {
//     const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
//     res.json(comments);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching comments" });
//   }
// });

// //  Delete Comment (Only author)
// app.delete("/comment/:commentId", async (req, res) => {
//   const token = req.cookies?.token;
//   if (!token) return res.status(401).json({ error: "Not authenticated" });

//   jwt.verify(token, secret, {}, async (err, user) => {
//     if (err) return res.status(403).json({ error: "Invalid token" });

//     const { commentId } = req.params;
//     const comment = await Comment.findById(commentId);
//     if (!comment) return res.status(404).json({ error: "Comment not found" });

//     if (comment.userId.toString() !== user.id) {
//       return res
//         .status(403)
//         .json({ error: "Unauthorized to delete this comment" });
//     }

//     await Comment.findByIdAndDelete(commentId);
//     res.json({ message: "Comment deleted" });
//   });
// });

app.listen(PORT, async () => {
  await connectDB();
  console.log("Server running on http://localhost:8080");
});

// const express = require("express");
// const cors = require("cors");
// const bcrypt = require("bcrypt");
// const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
// require("dotenv").config();

// const app = express();
// const salt = bcrypt.genSaltSync(10);
// const secret = "sadsdncdndvndkl579";
// const PORT = process.env.PORT || 8080;

// // Models
// const User = require("./models/user");
// const Post = require("./models/post");
// const Comment = require("./models/comment");

// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
// app.use(express.json());
// app.use(cookieParser());
// app.use("/uploads", express.static(__dirname + "/uploads"));

// async function connectDB() {
//   try {
//     await mongoose.connect(process.env.url);
//     console.log("MongoDB connected");
//   } catch (error) {
//     console.log("Error:", error);
//   }
// }

// //  User Registration
// app.post("/register", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const userDoc = await User.create({
//       username,
//       password: bcrypt.hashSync(password, salt),
//     });
//     res.json(userDoc);
//   } catch (e) {
//     res.status(400).json(e);
//   }
// });

// //  User Login
// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const userDoc = await User.findOne({ username });

//     if (!userDoc) {
//       return res.status(400).json({ error: "User not found" });
//     }

//     const passOk = bcrypt.compareSync(password, userDoc.password);
//     if (!passOk) {
//       return res.status(400).json({ error: "Wrong credentials" });
//     }

//     jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
//       if (err) return res.status(500).json({ error: "Error generating token" });

//       res.cookie("token", token, { httpOnly: true }).json({
//         id: userDoc._id,
//         username,
//       });
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// //  Get Profile
// app.get("/profile", (req, res) => {
//   const token = req.cookies?.token;

//   if (!token) return res.status(401).json({ error: "Not authenticated" });

//   jwt.verify(token, secret, {}, (err, info) => {
//     if (err) return res.status(403).json({ error: "Invalid token" });
//     res.json(info);
//   });
// });

// //  Logout
// app.post("/logout", (req, res) => {
//   res.cookie("token", "", { httpOnly: true }).json({ message: "Logged out" });
// });

// //  Create a Post
// const uploadMiddleWare = multer({ dest: "uploads/" });

// app.post("/post", uploadMiddleWare.single("file"), async (req, res) => {
//   try {
//     const { originalname, path: tempPath } = req.file;
//     const ext = path.extname(originalname);
//     const newPath = `${tempPath}${ext}`;
//     fs.renameSync(tempPath, newPath);

//     const { title, summary, content } = req.body;
//     const token = req.cookies?.token;

//     jwt.verify(token, secret, {}, async (err, info) => {
//       if (err) return res.status(403).json({ error: "Invalid token" });

//       const postDoc = await Post.create({
//         title,
//         summary,
//         content,
//         cover: newPath,
//         author: info.id,
//       });

//       res.json({ postDoc });
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Error creating post" });
//   }
// });

// //  Get all Posts
// app.get("/post", async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .populate("author", ["username"])
//       .sort({ createdAt: -1 })
//       .limit(20);
//     res.json(posts);
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// //  Get single Post by ID
// app.get("/post/:id", async (req, res) => {
//   const { id } = req.params;
//   const postDoc = await Post.findById(id).populate("author", ["username"]);
//   res.json(postDoc);
// });

// //  Update a Post
// app.put("/post", uploadMiddleWare.single("file"), async (req, res) => {
//   let newPath = null;
//   if (req.file) {
//     const { originalname, path: tempPath } = req.file;
//     const ext = path.extname(originalname);
//     newPath = `${tempPath}${ext}`;
//     fs.renameSync(tempPath, newPath);
//   }

//   const token = req.cookies?.token;

//   jwt.verify(token, secret, {}, async (err, info) => {
//     if (err) return res.status(403).json({ error: "Invalid token" });

//     const { id, title, summary, content } = req.body;
//     if (!id) return res.status(400).json({ error: "Post ID is required" });

//     try {
//       const postDoc = await Post.findById(id);
//       if (!postDoc) return res.status(404).json({ error: "Post not found" });

//       const isAuthor = postDoc.author.toString() === info.id;
//       if (!isAuthor) return res.status(403).json({ error: "Unauthorized" });

//       postDoc.set({
//         title,
//         summary,
//         content,
//         cover: newPath || postDoc.cover,
//       });

//       await postDoc.save();
//       res.json(postDoc);
//     } catch (error) {
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   });
// });

// //  Add Comment (Only logged-in users)

// app.post("/comment", async (req, res) => {
//   const token = req.cookies?.token;
//   if (!token) return res.status(401).json({ error: "Not authenticated" });

//   jwt.verify(token, secret, {}, async (err, user) => {
//     if (err) return res.status(403).json({ error: "Invalid token" });

//     const { postId, text } = req.body;
//     try {
//       const newComment = await Comment.create({
//         postId,
//         userId: user.id,
//         username: user.username,
//         text,
//       });
//       res.json(newComment);
//     } catch (error) {
//       res.status(500).json({ error: "Error adding comment" });
//     }
//   });
// });

// //  Get Comments for a Post
// app.get("/comment/:postId", async (req, res) => {
//   const { postId } = req.params;
//   try {
//     const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
//     res.json(comments);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching comments" });
//   }
// });

// //  Delete Comment (Only author)
// app.delete("/comment/:commentId", async (req, res) => {
//   const token = req.cookies?.token;
//   if (!token) return res.status(401).json({ error: "Not authenticated" });

//   jwt.verify(token, secret, {}, async (err, user) => {
//     if (err) return res.status(403).json({ error: "Invalid token" });

//     const { commentId } = req.params;
//     const comment = await Comment.findById(commentId);
//     if (!comment) return res.status(404).json({ error: "Comment not found" });

//     if (comment.userId.toString() !== user.id) {
//       return res
//         .status(403)
//         .json({ error: "Unauthorized to delete this comment" });
//     }

//     await Comment.findByIdAndDelete(commentId);
//     res.json({ message: "Comment deleted" });
//   });
// });

// // Start Server
// app.listen(PORT, async () => {
//   await connectDB();
//   console.log(`Server running on http://localhost:${PORT}`);
// });

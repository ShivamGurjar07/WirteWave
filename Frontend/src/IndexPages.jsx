import React, { useEffect, useState } from "react";
import Post from "./components/Post";

export default function IndexPages() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("https://wirtewave.onrender.com/post").then((res) => {
      res.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, []);
  return (
    <div className="mainPage">
      {posts.length > 0 &&
        posts.map((post) => <Post key={post.id} {...post} />)}
    </div>
  );
}

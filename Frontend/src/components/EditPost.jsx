// import React, { useEffect, useState } from "react";
// import Editor from "./Editor";
// import { Navigate, useParams } from "react-router-dom";

// export default function EditPost() {
//   const { id } = useParams();
//   const [title, setTitle] = useState("");
//   const [summary, setSummary] = useState("");
//   const [content, setContent] = useState("");
//   const [files, setFiles] = useState(null);
//   const [redirect, setRedirect] = useState(false);

//   useEffect(() => {
//     fetch(`http://localhost:8080/post/` + id).then((res) => {
//       res.json().then((postInfo) => {
//         setTitle(postInfo.title);
//         setContent(postInfo.content);
//         setSummary(postInfo.summary);
//       });
//     });
//   }, [id]);
//   async function updatePost(ev) {
//     ev.preventDefault();
//     const data = new FormData();
//     data.set("title", title);
//     data.set("summary", summary);
//     data.set("content", content);
//     data.set("id", id);
//     if (files?.[0]) {
//       data.set("file", files?.[0]);
//     }
//     const res = await fetch("http://localhost:8080/post", {
//       method: "PUT",
//       body: data,
//       credentials: "include",
//     });
//     if (res.ok) {
//       setRedirect(true);
//     }
//   }

//   if (redirect) {
//     return <Navigate to={`/post/${id}`} />;
//   }
//   return (
//     <form onSubmit={updatePost}>
//       <input
//         type="text"
//         placeholder={"Title"}
//         value={title}
//         onChange={(ev) => setTitle(ev.target.value)}
//       />
//       <input
//         type="text"
//         placeholder={"Summary"}
//         value={summary}
//         onChange={(ev) => setSummary(ev.target.value)}
//       />
//       <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
//       <Editor onChange={setContent} value={content} />
//       <button style={{ marginTop: "5px" }}>Update Post</button>
//     </form>
//   );
// }

import React, { useEffect, useState } from "react";
import Editor from "./Editor";
import { useParams, Navigate } from "react-router-dom";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState(null);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch(`https://wirtewave.onrender.com/post/${id}`)
      .then((res) => res.json())
      .then((postInfo) => {
        if (postInfo) {
          setTitle(postInfo.title);
          setSummary(postInfo.summary);
          setContent(postInfo.content);
        }
      })
      .catch((error) => console.error("Error fetching post:", error));
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault(); 

    const data = new FormData();
    data.append("id", id);
    data.append("title", title);
    data.append("summary", summary);
    data.append("content", content);
    if (files?.[0]) {
      data.append("file", files[0]);
    }

    const res = await fetch("https://wirtewave.onrender.com/post", {
      method: "PUT",
      body: data,
      // credentials: "include",
    });

    if (res.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }

  return (
    <form onSubmit={updatePost}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />
      <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
      <Editor value={content} onChange={setContent} />
      <button style={{ marginTop: "5px" }}>Update Post</button>
    </form>
  );
}

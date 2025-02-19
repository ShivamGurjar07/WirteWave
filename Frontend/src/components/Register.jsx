// import React, { useState } from "react";

// export default function Register() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   async function register(ev) {
//     ev.preventDefault();
//     if (!username || !password) {
//       alert("Username and password are required!");
//       return;
//     }

//     try {
//       const res = await fetch("https://wirtewave.onrender.com/register", {
//         method: "POST",
//         body: JSON.stringify({ username, password }),
//         headers: { "Content-Type": "application/json" },
//       });

//       const data = await res.json();

//       if (res.status === 200) {
//         alert("Registration successful");

//       } else {
//         alert(`Registration failed: ${data.message || "Unknown error"}`);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Something went wrong, please try again.");
//     }
//   }

//   return (
//     <div>
//       <h2 style={{ textAlign: "center" }}>Register Page</h2>
//       <form className="register" onSubmit={register}>
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(ev) => setUsername(ev.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(ev) => setPassword(ev.target.value)}
//         />
//         <button type="submit">Register</button>
//       </form>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // For navigation

  async function register(ev) {
    ev.preventDefault();
    if (!username || !password) {
      alert("Username and password are required!");
      return;
    }

    try {
      const res = await fetch("https://wirtewave.onrender.com/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.status === 200) {
        alert("Registration successful");
        navigate("/login"); // Redirect to login page
      } else {
        alert(`Registration failed: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong, please try again.");
    }
  }

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Register Page</h2>
      <form className="register" onSubmit={register}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

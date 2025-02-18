import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom"; 
import { UserContext } from "./UserContext";

export default function LoginPage() {
  const[username, setUsername] = useState("")
  const[password, setPassword] = useState("");
  const[redirect, setRedirect] = useState(false)
  const{setUserInfo} = useContext(UserContext);
  async function login(ev){
    ev.preventDefault();
    const res = await fetch("http://localhost:8080/login",{
      method:"POST",
      body:JSON.stringify({username, password}),
      headers:{"Content-Type":"application/json"},
      credentials:"include",
    })
    if (res.ok){
      res.json().then(userInfo=>{
        setUserInfo(userInfo);
        setRedirect(true);
      })
    }
    else{
      alert("wrong credentials")
    }
  }
  if(redirect){
    return <Navigate to={'/'}/>
  }
  return (
    <div>
    <h2 style={{ textAlign: "center" }} >Login Page</h2> 
    <form className="login" onSubmit={login}>
        <input type="text" 
         placeholder="username"
         value={username}
         onChange={ev=>setUsername(ev.target.value)}
          />
        <input type="password" 
         placeholder="password" 
         value={password}
         onChange={ev=>setPassword(ev.target.value)}
        />
        <button>Login</button>
      </form>
    </div>
  );
}

import React from "react";

export default function LoginPage() {
  return (
    <div>
    <h2 style={{ textAlign: "center" }}>Login Page</h2> 
    <form className="login">
        <input type="text" placeholder="username" />
        <input type="password" placeholder="password" />
        <button>Login</button>
      </form>
    </div>
  );
}

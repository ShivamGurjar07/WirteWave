// import React, { useContext, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { UserContext } from "./UserContext";

// const Header = () => {
//   const {setUserInfo, userInfo} = useContext(UserContext);
//   useEffect(()=>{
//     fetch("http://localhost:8080/profile",{
//       credentials:"include",
//     }).then(res=>{
//       res.json().then(userInfo=>{
//        setUserInfo(userInfo);
//       })
//     })
//   }, [])

//   function logout(){
//     fetch("http://localhost:8080/logout",{
//       credentials:"include",
//       method:'POST'
//     })
//     setUserInfo(null)
//   }

//   const username = userInfo?.username; 
//   return (
//     <div>
//       <header>
//         <Link to="/" href="" className="logo">
//           WriteWave
//         </Link>
//         <nav>
//         {username && (
//           <>
//              <Link to="/create">Create new post</Link>
//              <a onClick={logout}>Logout</a>
//           </>
//         )}
//         {!username && (
//           <>
//             <Link to="/register">Register</Link>
//             <Link to="/login">Login</Link>
//           </>
//         )}
         
//         </nav>
//       </header>
//     </div>
//   );
// };

// export default Header;



import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

const Header = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:8080/profile", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((userInfo) => {
        if (!userInfo.error) {
          setUserInfo(userInfo);
        }
      })
      .catch((err) => console.log("Error fetching profile:", err));
  }, []);

  function logout() {
    fetch("http://localhost:8080/logout", {
      credentials: "include",
      method: "POST",
    })
      .then(() => {
        setUserInfo(null);
      })
      .catch((err) => console.log("Error logging out:", err));
  }
  
  const username = userInfo?.username;

  return (
    <div>
      <header>
        <Link to="/" className="logo">
          WriteWave
        </Link>
        <nav>
          {username ? (
            <>
              <Link to="/create">Create new post</Link>
              <button onClick={logout} style={{ border: "none", background: "none", cursor: "pointer" }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          )}
        </nav>
      </header>
    </div>
  );
};

export default Header;

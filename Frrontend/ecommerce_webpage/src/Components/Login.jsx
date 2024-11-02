import React, { useContext, useState } from "react";
import { Link,Navigate } from 'react-router-dom'
import { Context } from "../main";
import axios from "axios";


function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const { isauthenticated,setisauthenticated, loading, setloading } = useContext(Context);

  const submitHandler = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
       await axios.post(`http://localhost:5000/login`, {
        password,
        email,
      },{
        withCredentials:true
      });
      console.log("success");
      alert("Login Successfull");
      setisauthenticated(true);
      setloading(false);
      setemail('')
      setpassword('')
    } catch (error) {
      alert(error.response.data.error);
      setisauthenticated(false);
      setloading(false);
    }
  };

  if(isauthenticated) return <Navigate to={'/'}/>
  return (
    <div className="login">
      <section>
        <form onSubmit={submitHandler}>
          <input
            value={email}
            required
            onChange={(e) => setemail(e.target.value)}
            type="text"
            placeholder="email"
          />

          <input
            value={password}
            required
            onChange={(e) => setpassword(e.target.value)}
            type="password"
            placeholder="password"
          />

          <button type="submit" disabled={loading}>
            Log In
          </button>
         
        </form>
      </section>
    </div>
  );
}

export default Login;

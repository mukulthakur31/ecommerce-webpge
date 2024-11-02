import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Context } from '../main';
import axios from 'axios';
import './Register.css'


function Register() {
  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');
  const [mobile, setmobile] = useState('');
  const [password, setpassword] = useState('');
  const [email, setemail] = useState('');

  const { setisauthenticated, isauthenticated, loading, setloading } = useContext(Context);

  const submitHandler = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      await axios.post(
        `http://localhost:5000/register`,
        {
          firstname,
          lastname,
          mobile,
          email,
          password
        },
        {
          withCredentials: true,
        }
      );
      console.log('success');
      alert('Signup Successful');
      setisauthenticated(true);
      setloading(false);
      setemail('');
      setfirstname('');
      setlastname('');
      setpassword('')
      setmobile('')
    } catch (error) {
      alert(error.response.data.error);
      setisauthenticated(false);
      setloading(false);
    }
  };

  if (isauthenticated) return <Navigate to={'/'} />;
  return (
    <div className="login">
      <section>
        <form onSubmit={submitHandler}>
          <input value={firstname} required onChange={(e) => setfirstname(e.target.value)} type="text" placeholder="firstname" />
          <input value={lastname} required onChange={(e) => setlastname(e.target.value)} type="text" placeholder="lastname" />
          <input value={email} required onChange={(e) => setemail(e.target.value)} type="text" placeholder="Email" />
          <input value={password} required onChange={(e) => setpassword(e.target.value)} type="password" placeholder="Password" />
          <input value={mobile} required onChange={(e) => setmobile(e.target.value)} type="text" placeholder="Mobile no." />
          <button type="submit" disabled={loading}>
            Sign Up
          </button>
        </form>
      </section>
    </div>
  );
}

export default Register;

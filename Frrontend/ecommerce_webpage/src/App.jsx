import React, { useEffect, useContext } from 'react';
import { Context } from './main';
import  fetchUserData  from './Components/utils/FetchUserData'; // Import fetchUserData utility
import Header from './Components/Header';
import Home from './Components/Home';
import Login from './Components/Login';
import axios from 'axios'
import Profile from './Components/Profile';
import Allorders from './Components/AllOrders'
import Register from './Components/Register';
import Cart from './Components/Cart';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Wishlist from './Components/Wishlist';

function App() {
  const { setisauthenticated,setloading,currentuser, setuser} = useContext(Context);

  useEffect(() => {
    fetchUserData(setloading, setuser, setisauthenticated); // Call fetchUserData
  }, []);
  useEffect(() => {
    const updateUserCart = async () => {
      if (currentuser) {
        try {
          const { data } = await axios.get('http://localhost:5000/profile', { withCredentials: true });
          setuser(data.user);
        } catch (error) {
          console.log(error);
        }
      }
    };

    updateUserCart();
  }, [currentuser?.cart]);
  

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/allorders" element={<Allorders/>} />
        <Route path="/cart" element={<Cart />} />    
        <Route path="/wishlist" element={<Wishlist />} />    
     </Routes>
    </Router>
  );
}

export default App;

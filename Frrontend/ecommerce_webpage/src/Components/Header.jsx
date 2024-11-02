import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { RiHeartFill } from 'react-icons/ri';
import { Context } from '../main';
import axios from 'axios'
import './Header.css'

function Header() {
  const { isauthenticated, setisauthenticated, loading, setloading } = useContext(Context);

  const logouthandler = async (e) => {
    setloading(true);
    try {
      await axios.get(`http://localhost:5000/logout`, {
        withCredentials: true,
      });

      alert("Logout Successfully");
      setisauthenticated(false);
      setloading(false);
    } catch (error) {
      alert("Something Went Wrong");
      console.log(error);
      setisauthenticated(true);
      setloading(false);
    }
  }

  return (
    <nav className='header' id="main-nav">
      <div className="logo-container">
        <Link to={'/'} className="logo">Logo</Link>
      </div>
      <article className="links-container">
        <Link to={'/'} id="home-link">Home</Link>
        {!isauthenticated && <Link to={'/register'} id="register-link">Register</Link>}
        <Link to={'/profile'} id="profile-link">Profile</Link>
        <Link to={'/allorders'} id="profile-link">All Orders</Link>
        
        <Link to={'/cart'} id="profile-link"><FaShoppingCart/></Link>
        <Link to="/wishlist" id="wishlist-link">
     <RiHeartFill />
  </Link>

        {isauthenticated ? (
          <button disabled={loading} onClick={logouthandler} id="logout-button">Logout</button>
        ) : (
          <Link to={'/login'} id="login-link">Log in</Link>
        )}
      </article>
    </nav>
  );
}

export default Header;

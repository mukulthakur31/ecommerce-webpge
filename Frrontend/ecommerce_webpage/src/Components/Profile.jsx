import React, { useState, useContext } from 'react';
import { Context } from '../main';
import axios from 'axios';
import './Profile.css';
import AddProductForm from './AddProduct'; // Assuming you have an AddProductForm component
import DeleteProductForm from './DeleteProduct'; // Assuming you have a DeleteProductForm component

function Profile() {
  const { currentuser } = useContext(Context);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showDeleteProductForm, setShowDeleteProductForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  if (!currentuser) {
    window.location.href = '/login';
    return null;
  }

  const handlePasswordChange = async () => {
    try {
      const response = await axios.put('http://localhost:5000/update', {
        oldPassword,
        newPassword
      },{
        withCredentials:true
      });

      if (response.status === 200) {
        setPasswordChangeSuccess(true);
        setPasswordChangeError('');
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.error) {
        setPasswordChangeError(error.response.data.error);
      } else {
        setPasswordChangeError('Internal server error');
      }
      setPasswordChangeSuccess(false);
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-heading">User Profile</h1>
      <h3>Name: {currentuser.firstname} {currentuser.lastname}</h3>
      <h3>Role: {currentuser.roles}</h3>
      <div className="profile-info">
        {/* Display user information */}
      </div>
      <button className="profile-button" onClick={() => setShowPasswordForm(true)}>Update Password</button>
      <button className="profile-button" onClick={() => setShowProductForm(true)}>Add Product</button>
      <button className="profile-button" onClick={() => setShowDeleteProductForm(true)}>Delete Product</button> {/* Button to show delete product form */}
      {showPasswordForm && (
        <div className="password-change-form">
          <h2>Change Password</h2>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className="password-change-button" onClick={handlePasswordChange}>Change Password</button>
          {passwordChangeError && <p className="error">{passwordChangeError}</p>}
          {passwordChangeSuccess && <p className="success">Password changed successfully!</p>}
        </div>
      )}
      {showProductForm && <AddProductForm />} {/* Render AddProductForm conditionally */}
      {showDeleteProductForm && <DeleteProductForm />} {/* Render DeleteProductForm conditionally */}
    </div>
  );
}

export default Profile;

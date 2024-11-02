import React, { useState } from 'react';
import axios from 'axios';

const DeleteProductForm = () => {
  const [productId, setProductId] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleChange = (e) => {
    setProductId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`http://localhost:5000/delete/${productId}`,{withCredentials:true});
      if (response.status === 200) {
        setDeleteSuccess(true);
        setDeleteError('');
      }
    } catch (error) {
        alert(error.response.data.error)
     
        setDeleteError(error.response.data.error);
      
      setDeleteSuccess(false);
    }
  };

  return (
    <div>
      <h2>Delete Product</h2>
      <form onSubmit={handleSubmit}>
        <label>Product ID:</label>
        <input type="text" value={productId} onChange={handleChange} required />
        <button type="submit">Delete Product</button>
      </form>
      {deleteSuccess && <p>Product deleted successfully!</p>}
      {deleteError && <p>Error: {deleteError}</p>}
    </div>
  );
};

export default DeleteProductForm;

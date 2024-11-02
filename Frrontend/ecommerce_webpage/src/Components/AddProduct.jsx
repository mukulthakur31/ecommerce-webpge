import React, { useState } from 'react';
import axios from 'axios';

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: '',
    rating: {
      rate: 0,
      count: 0
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('rating.')) {
      const ratingField = name.split('.')[1]; // Extract field name from 'rating.field' format
      setFormData({
        ...formData,
        rating: {
          ...formData.rating,
          [ratingField]: value // Update the specific field in rating object
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("hello");
    try {
      const response = await axios.post('http://localhost:5000/add', formData,{withCredentials:true});
      console.log('Product added:', response.data);
      // Optionally, you can redirect the user or show a success message
    } catch (error) {
      alert(error.response.data.error)
      // Optionally, you can show an error message to the user
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        <label>Price:</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />
        <label>Category:</label>
        <input type="text" name="category" value={formData.category} onChange={handleChange} required />
        <label>Image URL:</label>
        <input type="text" name="image" value={formData.image} onChange={handleChange} required />
        <label>Rating Rate:</label>
        <input type="number" name="rating.rate" value={formData.rating.rate} onChange={handleChange} required />
        <label>Rating Count:</label>
        <input type="number" name="rating.count" value={formData.rating.count} onChange={handleChange} required />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductForm;

// Home.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css'; // Import CSS file

const Home = () => {
  const [products, setProducts] = useState([]);
 

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/all', { withCredentials: true });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post('http://localhost:5000/addtocart', { productId }, { withCredentials: true });
      alert('Product added to cart successfully');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Error adding product to cart. Please try again.');
    }
  };

  const addToWishlist = async (productId) => {
    try {
      await axios.post('http://localhost:5000/wishlist', { productId }, { withCredentials: true });
      alert('Product added to wishlist successfully');
    } catch (error) {
      console.error('Error adding product to wishlist:', error);
      alert('Error adding product to wishlist. Please try again.');
    }
  };

  return (
    <div className='body'>
      <h2 className="heading">All Products</h2>
      <div className="home-container">
      {products.map((product) => (
        <div key={product._id} className="product-card">
          <div className="product-img">
          <img src={product.image} alt={product.title}  />
          </div>
          <div className="product-content">
            <h3 className="product-title">{product.title}</h3>
            <p className="product-price">Price: ${product.price}</p>
            <p className="product-category">Category: {product.category}</p>
            <p className="product-rating">Rating: {product.rating.rate} ({product.rating.count} reviews)</p>
             <div className='bottom-div'> <button className="add-to-cart-btn" onClick={() => addToCart(product._id)}>Add to Cart</button>
            <button className="add-to-wishlist-btn" onClick={() => addToWishlist(product._id)}>Add to Wishlist</button></div>
          </div>
          </div>
      ))}
      </div>
    </div>
  );
};

export default Home;

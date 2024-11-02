import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 for generating unique keys
import { Context } from '../main';
// import './wishlist.css'; // Import the CSS file

const Wishlist = () => {
  const { currentuser} = useContext(Context);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [total, setTotal] = useState(0);
//   const [wishlistFetched, setWishlistFetched] = useState(false); // Flag to track if wishlist items have been fetched

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        if (currentuser && currentuser.wishlist && currentuser.wishlist.length > 0) {
          const promises = currentuser.wishlist.map(async (productId) => {
            const response = await axios.get(`http://localhost:5000/product/${productId}`, { withCredentials: true });
            return response.data;
          });
  
          const products = await Promise.all(promises);
          setWishlistItems(products);
       // Set the flag to true after fetching wishlist items
        } else if (!currentuser || !currentuser.wishlist || currentuser.wishlist.length === 0) {
          // Clear wishlist items if user has no items in the wishlist
          setWishlistItems([]);
           // Set the flag to true even if there are no wishlist items
        }
      } catch (error) {
        console.error('Error fetching wishlist items:', error);
      }
    };
  
    fetchWishlistItems();
     // Reset the flag whenever currentuser changes
  }, [currentuser]); // Remove wishlistFetched from the dependency array
   // Include wishlistFetched in the dependency array

  useEffect(() => {
    let sum = 0;
    wishlistItems.forEach((item) => {
      sum += item.price;
    });
    setTotal(sum);
  }, [wishlistItems]);

  const removeFromWishlist = async (productId) => {
    try {
      await axios.post('http://localhost:5000/removewishlist', { productId }, { withCredentials: true });
      alert('Product removed from wishlist successfully');
      setWishlistItems(prevItems => prevItems.filter(item => item._id !== productId));
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
      alert('Error removing product from wishlist. Please try again.');
    }
  };

  const moveToCart = async (productId) => {
    try {
      // Add the product to the cart
      await axios.post('http://localhost:5000/addtocart', { productId }, { withCredentials: true });
      // Remove the product from the wishlist
      await axios.post('http://localhost:5000/removewishlist', { productId }, { withCredentials: true });
      alert('Product moved to cart successfully');
      // Remove the product from the wishlist items state
      setWishlistItems(prevItems => prevItems.filter(item => item._id !== productId));
    } catch (error) {
      console.error('Error moving product to cart:', error);
      alert('Error moving product to cart. Please try again.');
    }
  };

  return (
    <div className="wishlist-container">
      <h2>Wishlist</h2>
      <ul className="product-list">
        {wishlistItems.map((item) => (
          <li key={`${item._id}-${uuidv4()}`} className="product-item"> {/* Generate unique key */}
            <img src={item.image} alt={item.title} className="product-image" />
            <div className="product-details">
              <h3 className="product-title">{item.title}</h3>
              <p className="product-price">Price: ${item.price}</p>
              <p className="product-category">Category: {item.category}</p>
              <p className="product-description">Description: {item.description}</p>
              <button onClick={() => removeFromWishlist(item._id)}>Remove</button>
              <button onClick={() => moveToCart(item._id)}>Move to Cart</button>
            </div>
          </li>
        ))}
      </ul>
      <h1>Total: ${total}</h1>
    </div>
  );
};

export default Wishlist;

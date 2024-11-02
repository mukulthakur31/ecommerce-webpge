import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Context } from '../main';
import fetchUserData from './utils/FetchUserData';
import './cart.css'; // Import the CSS file

const Cart = () => {
  const { currentuser, setisauthenticated, setloading, setuser } = useContext(Context);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (currentuser && currentuser.cart && currentuser.cart.length > 0) {
          const promises = currentuser.cart.map(async (productId) => {
            const response = await axios.get(`http://localhost:5000/product/${productId}`, { withCredentials: true });
            return response.data;
          });

          const products = await Promise.all(promises);
          setCartItems(products);
        } else {
          // Clear cart items if user has no items in the cart
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [currentuser]);

  useEffect(() => {
    let sum = 0;
    cartItems.forEach((item) => {
      sum += item.price;
    });
    setTotal(sum);
  }, [cartItems]);

  const removeFromCart = async (productId) => {
    try {
      await axios.post('http://localhost:5000/deletefromcart', { productId }, { withCredentials: true });
      alert('Product removed from cart successfully');
      setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
    } catch (error) {
      console.error('Error removing product from cart:', error);
      alert('Error removing product from cart. Please try again.');
    }
  };

  const placeOrder = async () => {
    try {
      const orderItems = cartItems.map(item => ({
        product: item._id,
        quantity: 1,
        price: item.price
      }));

      // Calculate total based on the current cart items
      const sum = cartItems.reduce((acc, item) => acc + item.price, 0);

      const response = await axios.post(
        'http://localhost:5000/place',
        { user: currentuser._id, items: orderItems, total: sum },
        { withCredentials: true }
      );
      console.log(response);
      if (response.status === 201) {
        alert('Order placed successfully!');

        // Update cartItems state using a callback function
        setCartItems([]);
        setTotal(0);

        // Fetch user data again to update the cart
        fetchUserData(setloading, setuser, setisauthenticated);
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    }
  };

  return (
    <div className="cart-container">
      <h2>Cart</h2>
      <ul className="product-list">
        {cartItems.map((item, index) => (
          <li key={`${item._id}-${index}`} className="product-item"> {/* Generate unique key */}
            <img src={item.image} alt={item.title} className="product-image" />
            <div className="product-details">
              <h3 className="product-title">{item.title}</h3>
              <p className="product-price">Price: ${item.price}</p>
              <p className="product-category">Category: {item.category}</p>
              <p className="product-description">Description: {item.description}</p>
              <button onClick={() => removeFromCart(item._id)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
      <h1>Total: ${total}</h1>
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
};

export default Cart;

import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Context } from '../main';

function App() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentuser } = useContext(Context);

  // Function to fetch user orders
  async function fetchUserOrders() {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/user/${currentuser._id}`, {
        withCredentials: true
      });

      console.log("Response:", response.data); // Add this line to inspect the response data
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      setError(error.message);
      setLoading(false);
    
    }
  }

  // Handle button click to fetch orders
  const handleFetchOrders = () => {
    fetchUserOrders();
  };

  return (
    <div>
      <h1>User Orders</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <button onClick={handleFetchOrders}>Fetch Orders</button>
      <div>
        {orders.map(order => (
          <div key={order._id}>
            <h3>Order ID: {order._id}</h3>
            <p>Total: {order.total}</p>
            <p>Status: {order.status}</p>
            {order.items && order.items.length > 0 && (
              <div>
                <h4>Items:</h4>
                {order.items.map(item => (
                  <div key={item._id}>
                    
                    <p>ProductId: {item.product}</p>
                    <p>Price: {item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

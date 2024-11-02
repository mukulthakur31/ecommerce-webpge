import axios from 'axios';

const fetchUserData = async (setloading, setuser, setisauthenticated) => {
  // Set loading to true before fetching user data'
  setloading(true);
  try {
    const { data } = await axios.get('http://localhost:5000/profile', { withCredentials: true });
    setuser(data.user); // Update user state directly
    setisauthenticated(true);
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      // Unauthorized (user not logged in)
      alert('Please log in first.');
    }
    setuser(null);
    setisauthenticated(false);
  } finally {
    // Set loading to false after fetching user data
    setloading(false);
  }
};

export default fetchUserData;

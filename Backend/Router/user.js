const express = require("express");
const router = express.Router();
const User = require("../Models/user");
const bcrypt = require("bcrypt");
const { jwtAuthMiddleware, generateToken } = require("./../Jwt");

// router.post('/register',async(req,res)=>{
//     try {
//         const data = req.body
//         const adminUser = await User.findOne({ roles: 'admin' });
//         if (data.roles === 'admin' && adminUser) {
//             return res.status(400).json({ error: 'Admin user already exists' });
//         }
//         console.log(data);
//         const newuser = new User(data)

//         const response = await newuser.save();
//         console.log(response);
//         console.log("data saved ");

//         const payload ={
//             id:response.id
//         }

//         console.log(JSON.stringify(payload));
//         const token = generateToken(payload)
//         console.log("token is ",token);
//         res.cookie("token", token, {
//             httpOnly:true,
//             maxAge: 15 * 60 * 1000
//         });

//         res.status(200).json({response: response});

//     } catch (error) {
//         console.log(error);
//         res.status(500).json(error);
//     }
// })
router.post("/register", async (req, res) => {
  try {
    const data = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    

    // Create a new user instance with hashed password
    const newUser = new User(data);

    // Save the user to the database
    const savedUser = await newUser.save();

    // Generate token for the user
    const token = generateToken({ id: savedUser.id });

    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    // Send response with the user data and token
    res.status(200).json({ user: savedUser, token });
  } catch (error) {
    console.error("Registration failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("isMatch:", isMatch); // Log the result of password comparison
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid  password" });
    }

    // Generate token for the user
    const token = generateToken({ id: user.id });

    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    // Send response with the token
    res.json({ token });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/logout", (req, res) => {
  res
    .status(200)
    .cookie("token", "", { expires: new Date(Date.now()) })
    .json({
      success: true,
      user: "logout",
    });
});

router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect("/login"); // Redirect to login page if user is not authenticated
    }

    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/update", jwtAuthMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userData = req.user;
    const userId = userData.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect old password" });
    }

    // Update the user's password without hashing it again
    user.password = newPassword;
    await user.save();
    
    res
      .status(200)
      .json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

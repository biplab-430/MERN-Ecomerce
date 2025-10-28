const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const User = require("../../Models/User");

const register = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    // 1. Validate input
    if (!userName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create user
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // 5. Respond
    res.status(201).json({
      success: true,
      message: "Registration completed successfully",
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//login

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exist, please register first",
      });
    }

    // 2. Check password
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password, please try again",
      });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { id: existingUser._id, role: existingUser.role, email: existingUser.email,
        userName:existingUser.userName
       },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    // 4. Send response
    // res
    //   .cookie("token", token, { httpOnly: true, secure: true })
    //   .status(200)
    //   .json({
    //     success: true,
    //     message: "Logged in successfully",
    //     user: {
    //       id: existingUser._id,
    //       email: existingUser.email,
    //       role: existingUser.role,
    //          userName:existingUser.userName
    //     },
    //   });
    res.status(200).json({
      success:true,
      message:"logged in success",
      token,
       user: {
          id: existingUser._id,
          email: existingUser.email,
          role: existingUser.role,
             userName:existingUser.userName
        },
    })
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// log out

const logout = (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // set to true in production (with HTTPS)
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while logging out",
    });
  }
};

// ///auth middleware
// const authMiddleware = async (req, res, next) => {
//   const token = req.cookies?.token;

//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: "Unauthorized user! No token provided.",
//     });
//   }

//   try {
//     const decoded = jwt.verify(token,'CLIENT_SECRET_KEY');
//     req.user = decoded;
//     next();
//   } catch (error) {
//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({
//         success: false,
//         message: "Session expired. Please log in again.",
//       });
//     }
//     res.status(401).json({
//       success: false,
//       message: "Unauthorized user! Invalid token.",
//     });
//   }
// };

///auth middleware
const authMiddleware = async (req, res, next) => {
  const authHeader=req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user! No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token,'CLIENT_SECRET_KEY');
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }
    res.status(401).json({
      success: false,
      message: "Unauthorized user! Invalid token.",
    });
  }
};


module.exports = { register,loginUser,logout,authMiddleware };

const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, SuccessResponse } = require("../utils/errors/app.error");
const { generateToken, checkPassword, verifyToken, generateRefreshToken } = require("../utils/common/auth");
const { User } = require("../models");
const { where } = require("sequelize");
const ServerConfig = require("../config");


// console.log("User", User);

async function loginWithPassword(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({where: {username: username}});
    if (!user ||!checkPassword(password,user.password)) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Invalid Credentials.'
      });
    }
    const accessToken = await generateToken(user);

    const { refreshToken, refreshTokenExpiry } = await generateRefreshToken(user);
      // Check if refreshTokenExpiry is valid
      if (!refreshTokenExpiry || isNaN(refreshTokenExpiry.getTime())) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: 'Failed to generate a valid refresh token expiry date'
        });
      }
    // res.send({token});
    // req.session.user = user;
    user.refreshToken = refreshToken; 
    user.refreshTokenExpiry = refreshTokenExpiry;  
    await user.save();

    return res.status(StatusCodes.OK).json({
      message: 'Logged in successfully',
      data: { 
        user: { id: user.id, username: user.username }, 
        accessToken, 
        refreshToken 
       }
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        error: error.message,
    });
  }
}

async function loginWithPin(req, res) {
    try {
        const { username, pin } = req.body;
        const user = await User.findOne({ where: { username }});
        if(!user || user.pin !== pin) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'Invalid Credentials'
            });
        }
        const accessToken = await generateToken(user);
        console.log("Generated Access Token (PIN Login):", accessToken);
        const { refreshToken, refreshTokenExpiry } = await generateRefreshToken(user);

        // Save the refresh token and expiry to the database
        user.refreshToken = refreshToken;
        user.refreshTokenExpiry = refreshTokenExpiry; // Save expiry date
        await user.save();
        return res.status(StatusCodes.OK).json({
            message: "Login Successfull",
            data: {
                user: { id: user.id, username: user.username },
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}

async function logout(req, res) {
    try {
      // Extract the token from the Authorization header
      const authHeader = req.headers.authorization;
  
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: 'Authorization token not found or invalid'
        });
      }
  
      // Get the token from the header
      const token = authHeader.split(' ')[1];

      console.log("Token being sent for logout:", token);

  
      // Verify the token and extract the user data
      const decoded = await verifyToken(token, ServerConfig.JWT_SECRET); // Use your JWT secret
  
      // Find the user based on the decoded token
      const user = await User.findByPk(decoded.id);  // Assuming the user ID is in the token payload
  
      if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: 'User not found'
        });
      }
  
      // Clear the refresh token in the database
      user.refreshToken = null;
      await user.save();
  
      return res.status(StatusCodes.OK).json({ message: 'Logged out successfully' });
  
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Logout failed',
        error: error.message
      });
    }
  }
  
  

async function refreshAccessToken(req, res) {
    try {
      const { refreshToken } = req.body;
  
      if (!refreshToken) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Refresh token is required'
        });
      }
  
      // Find the user associated with the refresh token
      const user = await User.findOne({ where: { refreshToken } });
      if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: 'Invalid refresh token'
        });
      }

      // Check if the refresh token has expired
      const now = new Date();
      if (!user.refreshToken || user.refreshTokenExpiry < now) {
          return res.status(StatusCodes.UNAUTHORIZED).json({
              message: 'Refresh token has expired or is Invalid'
          });
      }
  
      // Verify the refresh token
      const decoded = await verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
      if (!decoded) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: 'Invalid or expired refresh token'
        });
      }
  
      // Generate a new access token
      const accessToken = await generateToken(user);
      
      return res.status(StatusCodes.OK).json({
        message: 'Access token refreshed successfully',
        data: { accessToken }
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        error: error.message
      });
    }
  }

module.exports = {
    loginWithPassword,
    logout,
    loginWithPin,
    refreshAccessToken,

}




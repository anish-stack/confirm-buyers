const sendToken = async (user, statusCode, res,generatedOTP) => {
    try {
      const token = user.getJwtToken(); // Assuming 'getJwtToken' is a method in your user model to generate the JWT token
      const expirationInHours = parseInt(process.env.JWT_EXPIRES_IN || '4d');
      console.log(expirationInHours);
      const expirationTime = new Date(Date.now() + expirationInHours * 60 * 60 * 1000); // Convert hours to milliseconds
  
      const options = {
        expires: expirationTime,
        httpOnly: false,
        secure: true,
      };
  
      // Set the 'token' cookie with the token value and options
      res.cookie('token', token, options, {
       
      });
  
      // Return the token as JSON in the response
      res.status(statusCode).json({
        success: true,
        login: user,
        token,
        generatedOTP
      });
    } catch (error) {
      console.error('Error sending token:', error);
      res.status(500).json({
        success: false,
        message: 'Error sending token',
        error: error.message,
      });
    }
  };
  
  module.exports = sendToken;

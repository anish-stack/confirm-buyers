require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
    try {
        // Extract the token from various sources (cookies, body, headers)
        const token =
            req.cookies.token || req.body.token || (req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : '');

        // console.log("Token in protect middleware:", token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Please Login to Access this',
            });
        }

        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log("Decoded user information:", decoded);
            req.user = decoded; // Attach the decoded user information to the request object
            next(); // Continue to the next middleware
        } catch (error) {
            console.error("Error verifying token:", error);
            return res.status(401).json({
                success: false,
                message: 'Invalid token',
            });
        }
    } catch (error) {
        // Handle any other errors that might occur within the middleware
        // console.error("Error in protect middleware:", error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

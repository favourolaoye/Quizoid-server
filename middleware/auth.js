const jwt = require('jsonwebtoken');
const secret = "6c8b0f32-9d45-4f77-a19b-9e35a96bca8a";
require("dotenv").config();
module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  console.log('secret:', secret);

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded.user; 
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

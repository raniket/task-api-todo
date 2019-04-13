const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decodedJwt = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decodedJwt;
    next();
  } catch (error) {
    res.status(401).json({message: 'Auth failed'});
  }
}
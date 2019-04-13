module.exports = (req, res, next) => {
  console.log('authrized-user')
  const userId = req.params.userId;
  const userData = req.userData.id;
  console.log('userId :: ', userId);
  console.log('userData :: ', userData);
  if (userId === userData) {
    next();
  } else {
    res.status(401).json({ message: 'Auth failed' });
  }
};
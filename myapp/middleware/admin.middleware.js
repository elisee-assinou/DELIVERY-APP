module.exports = (req, res, next) => {
    if (req.auth && req.auth.isAdmin) {
      // L'utilisateur est un administrateur, il peut accéder à la route
      next();
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }
  };
  
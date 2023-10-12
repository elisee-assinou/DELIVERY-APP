const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Récupérez le jeton JWT depuis l'en-tête de la requête
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Vérifiez et décodez le jeton JWT
  jwt.verify(token, 'RANDOM_TOKEN_SECRET', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Stockez les informations de l'utilisateur dans req.auth
    req.auth = decoded;

    next();
  });
};

const logger = require('../utils/logger');

function logMiddleware(req, res, next) {
  logger.info({ message: `Incomming request`, method: req.method, url:`${req.protocol}://${req.get('host')}${req.originalUrl}` });
  next();
}

module.exports = logMiddleware;



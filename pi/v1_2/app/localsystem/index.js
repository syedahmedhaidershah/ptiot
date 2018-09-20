const localRoutes = require('./local_routes');

module.exports = function(app, db) {
    localRoutes(app, db);
  // Other route groups could go here, in the future
};
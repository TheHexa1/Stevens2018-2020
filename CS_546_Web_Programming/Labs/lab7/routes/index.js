const animalsRoutes = require('./animals');
const postRoutes = require('./posts');
const likesRoutes = require('./likes');

const constructorMethod = (app) => {
  app.use('/animals', animalsRoutes);
  app.use('/posts', postRoutes);
  app.use('/likes', likesRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Not found'});
  });
};

module.exports = constructorMethod;

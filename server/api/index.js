const router = require('express').Router()


//other routes go here
//router.use('/users', require('./users'));

router.use('/users', require('./users'))



//404 (not found) error handling
router.use(function (req, res, next) {
  const err = new Error('Not found.');
  err.status = 404;
  next(err);
});

module.exports = router;
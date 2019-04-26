const router = module.exports = require('express').Router();

router.get('/', (req, res) => {
  return res.status(200).send('ok');
});
const uuidv4 = require('uuid')
const router = module.exports = require('express').Router();

router.get('/', (req, res) => {
  return res.send(Object.values(req.context.models.messages));
});

router.get('/:messageId', (req, res) => {
  return res.send(req.context.models.messages[req.params.messageId]);
});

router.post('/', (req, res) => {
  const id = uuidv4();
  const message = {
    id,
    text: req.body.text,
    userId: req.context.me.id,
  };
  req.context.models.messages[id] = message;
  return res.send(message);
});

router.delete('/:messageId', (req, res) => {
  if(req.context.models.messages[req.params.messageId]){
    delete req.context.models.messages[req.params.messageId];
  }
  return res.send(req.context.models.messages);
});
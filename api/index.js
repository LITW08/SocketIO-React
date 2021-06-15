const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');

router.get('/', (req, res) => {
    req.io.emit('message_from_server', {message: 'Someone somewhere asked for a guid!'});
    res.json({guid: uuidv4()});
});

module.exports = router;
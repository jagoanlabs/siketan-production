const router = require('express').Router();
const { auth } = require('../../midleware/auth');
const { chat, tambahChat, rating, tambahRating } = require('../controllers/liveChat');

router.post('/chat/add', auth, tambahChat);
router.post('/rating/add', auth, tambahRating);
router.get('/chats', auth, chat);
router.get('/rating', auth, rating);

module.exports = router;

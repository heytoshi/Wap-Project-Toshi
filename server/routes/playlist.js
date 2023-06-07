const express = require('express');
const router = express.Router();

const { getSongs, addSongMyPlaylist, getMyPlaylist,removeSongMyPlaylist, getSong } = require('../controller/playlist');
const { authMiddleware } = require('../middleware/authentication');

router.get('/playlist/get/songs', getSongs);
router.post('/playlist/add/songs', authMiddleware, addSongMyPlaylist);
router.get('/playlist/get/playlist/:username', authMiddleware, getMyPlaylist);
router.put('/playlist/remove/songs', authMiddleware, removeSongMyPlaylist);
router.get('/playlist/get/playlist/song/:filename', getSong);

module.exports = router;
const db = require("../db/db.js");

const getSongs = (req, res) => {
  if (db.songList === undefined || db.songList.length === 0) {
    res.status(404).json({
      error: "Song list does not exist",
    });
  } else {
    res.status(200).json(db.songList);
  }
};

const getMyPlaylist = (req, res) => {
  const username = req.params.username;

  const user = db.users.find((user) => user.username === username);
  if (user) {
    const playlist = user.playlist;
    res.status(200).json(playlist);
  } else {
    res.status(404).json({
      error: "User not found",
    });
  }
};

const removeSongMyPlaylist = (req, res) => {
  const username = req.body.username;
  const songIndex = req.body.index;
 
  if (songIndex === undefined || username === undefined) {
    res.status(404).json({
      error: "Undefined body variable",
    });
  } else {
    const user = db.users.find((user) => user.username === username);
    if (user) {
      const playlist = user.playlist;
      if (songIndex !== -1) {
        playlist.splice(songIndex - 1, 1);
        updatePlaylistIndexes(playlist, songIndex - 1);
        res.status(200).json({
          message: "Song removed from playlist",
        });
      } else {
        res.status(404).json({
          error: "Song not found in playlist",
        });
      }
    } else {
      res.status(404).json({
        error: "User not found",
      });
    }
  }
};

const updatePlaylistIndexes = (playlist, removedIndex) => {
  for (let i = removedIndex; i < playlist.length; i++) {
    playlist[i].index--;
  }
};

const addSongMyPlaylist = (req, res) => {
  const username = req.body.username;
  const songId = req.body.id;

  if (songId === undefined || username === undefined) {
    res.status(404).json({
      error: "Undefined body variable",
    });
  } else {
    const user = db.users.find((user) => user.username === username);
    if (user) {
      const playlist = user.playlist;
      const songIndex = playlist.findIndex((song) => song.id === songId);
      if (songIndex === -1) {
        const lastIndex =
          playlist.length > 0 ? playlist[playlist.length - 1].index : 0;
        const newSong = {
          index: lastIndex + 1,
          id: songId,
          title: getSongTitle(songId),
        };
        playlist.push(newSong);
        res.status(200).json({
          message: "Song added to playlist",
          data: newSong,
        });
      } else {
        res.status(404).json({
          error: "Song already in playlist",
        });
      }
    } else {
      res.status(404).json({
        error: "User not found",
      });
    }
  }
};

const getSongTitle = (songId) => {
  const song = db.songList.find((song) => song.id === songId);
  return song ? song.title : null;
};

module.exports = { getSongs, addSongMyPlaylist, getMyPlaylist, removeSongMyPlaylist};

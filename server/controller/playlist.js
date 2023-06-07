const db = require("../db/db.js");
const fs = require("fs");
const path = require("path");

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

const getSong = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../songs", filename);

  if (fs.existsSync(filePath)) {
    const fileStat = fs.statSync(filePath);
    const fileSize = fileStat.size;

    const range = req.headers.range;

    if (range) {
      const [start, end] = range.replace(/bytes=/, "").split("-");
      const fileStream = fs.createReadStream(filePath, {
        start: parseInt(start),
        end: parseInt(end) || fileSize - 1,
      });

      const contentLength = end ? parseInt(end) - parseInt(start) + 1 : fileSize - parseInt(start);

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end || fileSize - 1}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "audio/mpeg",
      });

      fileStream.pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "audio/mpeg",
      });

      fs.createReadStream(filePath).pipe(res);
    }
  } else {
    res.status(404).send("File not found");
  }
};

module.exports = {
  getSongs,
  addSongMyPlaylist,
  getMyPlaylist,
  removeSongMyPlaylist,
  getSong,
};

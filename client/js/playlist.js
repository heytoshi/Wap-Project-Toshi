const url = "http://localhost:3000";

let data = [];
let playlistArray = [];

const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

document.addEventListener("click", function (event) {
  if (event.target.id === "add-button") {
    addToPlaylist(event);
  } else if (event.target.id === "remove-button") {
    removeFromPlaylist(event);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.querySelector(".logout-button");
  loginButton.addEventListener("click", logoutUser);

  fetch(url + "/playlist/get/songs", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((fetchedData) => {
      data = fetchedData;
      getMyPlaylist((result) => {
        playlistArray = result;
        renderTable();
        renderMyPlaylist();
      });
    })
    .catch((error) => {
      console.error(error);
    });
});

function renderTable() {
  let songList = '<div class="song-list">';
  songList += "<h1>Song You May Interest</h1>";
  songList += '<table class="table-container">';
  songList += '<tr class="first-child-songlist">';
  songList += "<td>id</td>";
  songList += "<td>Title</td>";
  songList += "<td>Release Date</td>";
  songList += "<td>Actions</td>";
  songList += "</tr>";

  for (let i = 0; i < data.length; i++) {
    songList += "<tr>";
    songList += "<td>" + data[i].id + "</td>";
    songList += "<td>" + data[i].title + "</td>";
    songList += "<td>" + data[i].releaseDate + "</td>";
    songList += `<td><i id="add-button" class="fa-solid fa-plus" data-id="${data[i].id}"></i></td>`;
    songList += "</tr>";
  }

  songList += "</table>";
  songList += "</div>";

  document.getElementById("table-parent-container").innerHTML = songList;
}

function renderMyPlaylist() {
  let myPlaylist = '<div class="my-playlist">';
  myPlaylist += "<h1>Your playlist</h1>";
  myPlaylist += '<table class="table-container">';
  myPlaylist += '<tr class="first-child-playlist">';
  myPlaylist += "<td>Index</td>";
  myPlaylist += "<td>Title</td>";
  myPlaylist += "<td>Actions</td>";
  myPlaylist += "</tr>";

  for (let i = 0; i < playlistArray.length; i++) {
    myPlaylist += `<tr id="playlistRow${playlistArray[i].index}">`;
    myPlaylist += "<td>" + playlistArray[i].index + "</td>";
    myPlaylist += "<td>" + playlistArray[i].title + "</td>";
    myPlaylist += `<td>
    <i id="remove-button" class="fa-solid fa-circle-minus" data-id="${playlistArray[i].index}"></i>
    <i class="fa-solid fa-play" data-index="${playlistArray[i].index}" data-title="${playlistArray[i].title}" data-src="${playlistArray[i].id}"></i>
    </td>`;
    myPlaylist += "</tr>";
  }

  myPlaylist += "</table>";
  myPlaylist += "</div>";
  document.getElementById("table-parent-container").innerHTML += myPlaylist;

  const playButtons = document.getElementsByClassName("fa-solid fa-play");
  for (let i = 0; i < playButtons.length; i++) {
    playButtons[i].addEventListener("click", handlePlayButton);
  }
}

function handlePlayButton(event) {
  const button = event.target;
  const songTitle = button.getAttribute("data-title");
  const songSrc = button.getAttribute("data-src");
  const songIndex = button.getAttribute("data-index");
  const songTitleElement = document.querySelector(".progress-bar-container h3");
  const songData = data.find((song) => song.id === parseInt(songSrc));

  audioPlayer.src = url + "/playlist/get/playlist/song/" + songSrc + ".mp3";
  audioPlayer.load();
  audioPlayer.play();

  songTitleElement.textContent = songTitle;
  currentSongIndex = songIndex - 1;

  playPauseButton.innerHTML =
    '<i id="playPauseButton" class="fa-solid fa-pause"></i>';
  isPlaying = true;
  previousSongs.push({index: parseInt(songIndex), id: songData.id, title: songData.title})

  musicPlayer.style.display = "flex";
}

function removeFromPlaylist(event) {
  const rowID = event.target.getAttribute("data-id");
  const rowElement = document.getElementById("playlistRow" + rowID);

  fetch(url + "/playlist/remove/songs", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username: username, index: rowID }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result) {
        rowElement.remove();
        playlistArray = playlistArray.filter(
          (song) => song.index !== parseInt(rowID)
        );
        playlistArray.forEach((song) => {
          if (song.index > parseInt(rowID)) {
            song.index--;
          }
        });

        const rows = document.querySelectorAll(
          '.my-playlist table tr[id^="playlistRow"]'
        );
        for (let i = parseInt(rowID) - 1; i < rows.length; i++) {
          const currentIndex = rows[i].id.replace("playlistRow", "");
          const newIndex = currentIndex - 1;
          rows[i].id = "playlistRow" + newIndex;
          rows[i]
            .querySelector("#remove-button")
            .setAttribute("data-id", newIndex);
          rows[i].querySelector("td:first-child").innerText = newIndex;
        }

        if (playlistArray.length === 0) {
          audioPlayer.pause();
          audioPlayer.currentTime = 0;
          musicPlayer.style.display = "none";
        }
      } else {
        alert("Failed to remove song from playlist");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function getMyPlaylist(callback) {
  fetch(url + `/playlist/get/playlist/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((fetchedData) => {
      callback(fetchedData);
    })
    .catch((error) => {
      console.log(error);
    });
}

function addToPlaylist(event) {
  const songId = event.target.getAttribute("data-id");
  const songData = data.find((song) => song.id === parseInt(songId));

  fetch(url + "/playlist/add/songs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username: username, id: songData.id }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.data) {
        let myPlaylistRow = `<tr id="playlistRow${result.data.index}">`;
        myPlaylistRow += "<td>" + result.data.index + "</td>";
        myPlaylistRow += "<td>" + result.data.title + "</td>";
        myPlaylistRow += `<td>
        <i id="remove-button" class="fa-solid fa-circle-minus" data-id="${result.data.index}"></i>
        <i class="fa-solid fa-play" data-index="${result.data.index}" data-title="${result.data.title}" data-src="${result.data.id}"></i>
        </td>`;

        myPlaylistRow += "</tr>";

        const myPlaylistTable = document.querySelector(".my-playlist table");
        myPlaylistTable.innerHTML += myPlaylistRow;

        const playButtons = document.getElementsByClassName("fa-solid fa-play");

        for (let i = 0; i < playButtons.length; i++) {
          playButtons[i].addEventListener("click", handlePlayButton);
        }

        playlistArray.push(result.data);
      } else {
        alert("Song already in playlist");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "index.html";
}

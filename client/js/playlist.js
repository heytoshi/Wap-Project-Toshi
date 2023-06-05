const url = "http://localhost:3000";
let data = [];

const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.querySelector(".logout-button");
  loginButton.addEventListener("click", logoutUser);

  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-button")) {
      addToPlaylist(event);
    }
  });

  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("minus-button")) {
      removeFromPlaylist(event);
    }
  });

  fetch(url + "/playlist/get/songs", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((fetchedData) => {
      data = fetchedData;
      renderTable();
      renderMyPlaylist();
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
    songList +=
      '<td><button class="add-button" data-id="' +
      data[i].id +
      '">+</button></td>';
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

  getMyPlaylist((result) => {
    for (let i = 0; i < result.length; i++) {
      myPlaylist += `<tr id="playlistRow${result[i].index}">`;
      myPlaylist += "<td>" + result[i].index + "</td>";
      myPlaylist += "<td>" + result[i].title + "</td>";
      myPlaylist +=
        "<td><button class='minus-button' data-id=" +
        result[i].index +
        ">-</button> <button class='play-button'>Play</button></td>";
      myPlaylist += "</tr>";
    }

    myPlaylist += "</table>";
    myPlaylist += "</div>";

    document.getElementById("table-parent-container").innerHTML += myPlaylist;
  });
}

function removeFromPlaylist(event) {
  const rowID = event.target.getAttribute("data-id");
  const rowElement = document.getElementById("playlistRow" + rowID);

  fetch("http://localhost:3000/playlist/remove/songs", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username: username, index: rowID}),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result) {
        rowElement.remove()

        //update index and id
        const rows = document.querySelectorAll('.my-playlist table tr[id^="playlistRow"]');
        for (let i = parseInt(rowID) - 1; i < rows.length; i++) {
          const currentIndex = rows[i].id.replace("playlistRow", "");
          const newIndex = currentIndex - 1;
          rows[i].id = "playlistRow" + newIndex;
          rows[i].querySelector('.minus-button').setAttribute("data-id", newIndex);
          rows[i].querySelector('td:first-child').innerText = newIndex;
        }
      } else {
        alert("Failed to remove song from playlist")
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
      callback([]);
    });
}

function addToPlaylist(event) {
  const songId = event.target.getAttribute("data-id");
  const songData = data.find((song) => song.id === parseInt(songId));

  fetch("http://localhost:3000/playlist/add/songs", {
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
        myPlaylistRow +=
          "<td><button class='minus-button' data-id=" +
          result.data.index +
          ">-</button> <button class='play-button'>Play</button></td>";
        myPlaylistRow += "</tr>";

        const myPlaylistTable = document.querySelector(".my-playlist table");
        myPlaylistTable.innerHTML += myPlaylistRow;
      } else {
        alert("Song already in playlist");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "index.html";
}

const audioPlayer = document.getElementById("audioPlayer");
const playPauseButton = document.getElementById("playPauseButton");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const progressBarContainer = document.querySelector(".progress-bar-container");
const progressBar = document.getElementById("progress");
const progressBall = document.getElementById("progress-ball");
const songTitleElement = document.querySelector(".progress-bar-container h3");
const musicPlayer = document.querySelector(".music-player");
const extraControls = document.querySelector(".extra-controls");

let isPlaying = false;
let isDragging = false;
let playMode = "sequential";
let currentSongIndex = 0;
let previousSongs = [];

playPauseButton.addEventListener("click", togglePlayPause);
prevButton.addEventListener("click", playPreviousSong);
nextButton.addEventListener("click", playNextSong);
progressBarContainer.addEventListener("mousedown", startDrag);

audioPlayer.addEventListener("timeupdate", updateProgressBar);
audioPlayer.addEventListener("ended", handleSongEnd);

progressBar.addEventListener("mousedown", (event) => {
  isDragging = true;
  dragProgress(event);
});

extraControls.addEventListener("click", function(event) {
  if (event.target.id === "shuffleButton") {
    toggleShuffle();
  }
});

document.addEventListener("mousemove", (event) => {
  dragProgress(event);
});

document.addEventListener("mouseup", (event) => {
  stopDrag(event);
});

function togglePlayPause() {
  if (isPlaying) {
    audioPlayer.pause();
    playPauseButton.innerHTML =
      '<i id="playPauseButton" class="fas fa-play"></i>';
  } else {
    audioPlayer.play();
    playPauseButton.innerHTML =
      '<i id="playPauseButton" class="fa-solid fa-pause"></i>';
  }
  isPlaying = !isPlaying;
}

function toggleShuffle() {
  if (playMode === "sequential") {
    playMode = "shuffle";
    extraControls.innerHTML = '<i id="shuffleButton" class="fa-solid fa-shuffle"></i>'
  } else if (playMode === "shuffle") {
    playMode = "repeat";
    extraControls.innerHTML = '<i id="shuffleButton" class="fa-solid fa-repeat"></i>';
  } else if (playMode === "repeat") {
    playMode = "sequential";
    extraControls.innerHTML = '<i id="shuffleButton" class="fa-solid fa-arrow-down-short-wide"></i>';
  }
}

function playPreviousSong() {
  if (playMode === "shuffle" && previousSongs.length > 1) {
    previousSongs.pop();
    playSong(previousSongs[previousSongs.length - 1], false);
    currentSongIndex = playlistArray.findIndex(e => e.id === previousSongs[previousSongs.length - 1].id);
  } else {
    currentSongIndex = (currentSongIndex - 1 + playlistArray.length) % playlistArray.length;
    const previousSong = playlistArray[currentSongIndex];
    playSong(previousSong, false);
  }
}

function playNextSong() {
  if (playMode === "shuffle" && playlistArray.length > 1) {
      const nextSong = getRandomSong();
      currentSongIndex = playlistArray.indexOf(nextSong);
      playSong(nextSong, true);
    
  } else {
    currentSongIndex = (currentSongIndex + 1) % playlistArray.length;
    const nextSong = playlistArray[currentSongIndex];
    playSong(nextSong, true);
  }
}

function getRandomSong() {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * playlistArray.length);
  } while (randomIndex === currentSongIndex);
  return playlistArray[randomIndex];
}

function playSong(song, next) {
  audioPlayer.src = url + "/playlist/get/playlist/song/" + song.id + ".mp3";
  audioPlayer.load();
  audioPlayer.play();

  playPauseButton.innerHTML =
  '<i id="playPauseButton" class="fa-solid fa-pause"></i>';

  isPlaying = true;
  songTitleElement.textContent = song.title;
  
  if(next) {
    previousSongs.push(song);
  }
}

function startDrag() {
  isDragging = true;
}

function stopDrag(event) {
  if (isDragging) {
    isDragging = false;
    const progressBarWidth = progressBarContainer.offsetWidth;
    const clickX =
      event.clientX - progressBarContainer.getBoundingClientRect().left;
    const percentageClicked = (clickX / progressBarWidth) * 100;
    const seekTime = (percentageClicked / 100) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
  }
}

function dragProgress(event) {
  if (isDragging) {
    const progressBarWidth = progressBarContainer.offsetWidth;
    const clickX =
      event.clientX - progressBarContainer.getBoundingClientRect().left;
    const percentageClicked = (clickX / progressBarWidth) * 100;
    const progressWidth = Math.min(100, Math.max(0, percentageClicked));
    progressBar.style.width = `${progressWidth}%`;
    progressBall.style.left = `${progressWidth}%`;
  }
}

function updateProgressBar() {
  const currentTime = audioPlayer.currentTime;
  const duration = audioPlayer.duration;
  const progressPercentage = (currentTime / duration) * 100;
  progressBar.style.width = `${progressPercentage}%`;
  progressBall.style.left = `${progressPercentage}%`;
}

function handleSongEnd() {
  if (playMode === "sequential") {
    playNextSong();
  } else if (playMode === "shuffle") {
    if (playlistArray.length > 1) {
      const nextSong = getRandomSong();
      currentSongIndex = playlistArray.indexOf(nextSong);
      console.log(currentSongIndex)
      playSong(nextSong, true);
    } else {
      playNextSong();
    }
  } else if (playMode === "repeat") {
    audioPlayer.currentTime = 0;
    audioPlayer.play();
  }
}

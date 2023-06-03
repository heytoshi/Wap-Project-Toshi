document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.querySelector(".logout-button");
  loginButton.addEventListener("click", logoutUser);

  const products = [
    { id: 1, title: "song1", releaseDate: "2020-01-01" },
    { id: 2, title: "song2", releaseDate: "2020-01-01" },
    { id: 3, title: "song3", releaseDate: "2020-01-01" },
  ];
  
  let html = '<div class="song-list">';
  html += "<h1>Song You May Interest</h1>";
  html += '<table class="table-container">';
  html += "<tr>";
  html += "<td>id</td>";
  html += "<td>Title</td>";
  html += "<td>Release Date</td>";
  html += "<td>Actions</td>";
  html += "</tr>";
  
  for (let i = 0; i < products.length; i++) {
    html += "<tr>";
    html += "<td>" + products[i].id + "</td>";
    html += "<td>" + products[i].title + "</td>";
    html += "<td>" + products[i].releaseDate + "</td>";
    html +='<td>'+ '+' +'</td>';
    html += "</tr>";
  }
  
  html += "</table>";
  html += "</div>";
  
  document.getElementById("table-parent-container").innerHTML = html;
});

function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "index.html";
}



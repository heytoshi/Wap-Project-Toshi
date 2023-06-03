document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.querySelector(".logout-button");
  loginButton.addEventListener("click", logoutUser);
});

function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "index.html";
}

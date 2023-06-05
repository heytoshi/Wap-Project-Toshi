document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.querySelector(".login-button");
  loginButton.addEventListener("click", loginUser);
});

function loginUser() {
  const usernameInput = document.querySelector("#username");
  const passwordInput = document.querySelector("#password");

  const loginData = {
    username: usernameInput.value,
    password: passwordInput.value,
  };

  fetch("http://localhost:3000/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", usernameInput.value);
      if (data.token) {
        window.location.href = "playlist.html";
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

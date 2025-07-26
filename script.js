// script.js

document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("modeToggle");

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      toggleBtn.textContent = "🌞 Light Mode";
    } else {
      toggleBtn.textContent = "🌙 Dark Mode";
    }
  });
});

function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('show');
}

document.getElementById("generate").addEventListener("click", function () {
  /* Code to generate color palette goes here */
  const palette = document.getElementById("palette");
  palette.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    let div = document.createElement("div");
    div.style.backgroundColor = color;

    let span = document.createElement("span");
    span.textContent = color;

    div.appendChild(span);

    palette.appendChild(div);
  }
});

function showNotification(message) {
  /* Code to show notification goes here */
  let div = document.createElement("div");
  div.classList.add("notification");
}

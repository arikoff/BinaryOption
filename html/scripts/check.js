var checkbox = document.getElementById("accept");
var betbox = document.getElementById("betbox");
var button = document.getElementById("betbutton");

checkbox.addEventListener("change", function (e) {
  button.disabled = !(this.checked && Number(betbox.value) > 0);
});

betbox.addEventListener("input", function (e) {
  button.disabled = !(checkbox.checked && Number(this.value) > 0);
});

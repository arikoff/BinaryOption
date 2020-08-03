var selection = document.getElementById("currSelect");
selection.addEventListener("change", changeOption);

function changeOption() {
  var selectedOption = selection.options[selection.selectedIndex];
  selection.style.backgroundImage =
    "url('img/" + selectedOption.value + ".png')";

  drawChart(selectedOption.value);
  updateBetBTC();
}

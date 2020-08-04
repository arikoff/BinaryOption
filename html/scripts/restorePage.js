function restorePage() {
  document.getElementById("main").classList.remove("hidden");
  document.getElementById("result").classList.add("hidden");
  document.getElementById("resultwin").classList.add("hidden");
  document.getElementById("resultlost").classList.add("hidden");
  document.getElementById("resultdraw").classList.add("hidden");
  document.getElementById("accept").checked = false;
  document.getElementById("accept").disabled = false;
  document.getElementById("betbox").value = "0.00";
  document.getElementById("betbutton").disabled = false;
  document.getElementById("currSelect").disabled = false;
  document.getElementById("betbox").disabled = false;
  const elements = document.getElementsByName("direction");
  for (i = 0; i < elements.length; i++) {
    elements.item(i).disabled = false;
  }
}

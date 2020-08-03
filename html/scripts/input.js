function validate(e) {
  e.value = e.value.replace(/[^0-9.]/g, "");
  while ((e.value.match(/[.]/g) || []).length > 1) {
    var pos = e.value.lastIndexOf(".");
    e.value = e.value.substring(0, pos) + e.value.substring(pos + 1);
  }
  if (e.value.indexOf(".") != "-1") {
    if (e.value.indexOf(".") == 0) {
      e.value = "0" + e.value;
    }
    e.value = e.value.substring(0, e.value.indexOf(".") + 3);
  }
  updateBetBTC();
  return false;
}

function updateBetBTC() {
  const bet = document.getElementById("betbox").value;
  const currSelect = document.getElementById("currSelect");
  const currency = currSelect.value;
  const arr = JSON.parse(localStorage.getItem(currency));
  const rate = arr[arr.length - 1].value;

  let betBTC = (bet / rate).toFixed(6);
  document.getElementById("betBTC").innerHTML = betBTC + " BTC";
}

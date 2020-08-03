var selection = document.getElementById("currSelect");

initialize().then(
  setInterval(() => {
    const currency = selection.options[selection.selectedIndex].value;
    arr = JSON.parse(localStorage.getItem(currency));
    const URL =
      "http://127.0.0.1:8080/update?updatedBefore=" +
      +new Date(arr[arr.length - 1].date);
    const options = {};
    fetch(URL, options)
      .then((response) => response.json())
      .then((data) => refreshRates(data));
  }, 60000)
);

function refreshRates(data) {
  document.getElementById("rateUSD").innerHTML = data.USD;
  document.getElementById("rateEUR").innerHTML = data.EUR;
  document.getElementById("rateGBP").innerHTML = data.GBP;

  addValueToStorage("usd", data.updatedAt, data.USD);
  addValueToStorage("eur", data.updatedAt, data.EUR);
  addValueToStorage("gbp", data.updatedAt, data.GBP);

  const currency = selection.options[selection.selectedIndex].value;

  drawChart(currency);
}

function addValueToStorage(currency, updatedAt, value) {
  arr = JSON.parse(localStorage.getItem(currency));
  arr.push({ date: updatedAt, value: value });
  localStorage.setItem(currency, JSON.stringify(arr));
}

function initialize() {
  return new Promise(function (resolve, reject) {
    initializeChart("usd");
    initializeChart("eur");
    initializeChart("gbp");
  });
}

function initializeChart(currency) {
  const URL = "http://127.0.0.1:8080/initialize?currency=" + currency;
  const options = {};
  fetch(URL, options)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      document.getElementById("rate" + currency.toUpperCase()).innerHTML =
        data[data.length - 1].value;
      localStorage.setItem(currency, JSON.stringify(data));
    });
}

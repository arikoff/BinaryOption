function onClick() {
  //отключили кнопку
  document.getElementById("betbutton").disabled = true;
  document.getElementById("accept").disabled = true;
  //включили надпись "ожидание"
  document.getElementById("awaiting").classList.remove("hidden");

  const currSelect = document.getElementById("currSelect");
  const betbox = document.getElementById("betbox");

  //отключаем доступность элементов
  betbox.disabled = true;
  currSelect.disabled = true;

  const elements = document.getElementsByName("direction");
  for (i = 0; i < elements.length; i++) {
    elements.item(i).disabled = true;
  }

  //получаем текущие значения для проверки и расчета выигрыша/проигрыша
  //валюта
  const currency = currSelect.value;
  //размер ставки в валюте
  const bet = +betbox.value;
  //размер ставки в валюте
  let betBTC = 0;
  const l = document.getElementById("betBTC").innerHTML.length;
  if (l > 4) {
    betBTC = +document.getElementById("betBTC").innerHTML.slice(0, l - 4);
  }
  //направление
  const radio = document.getElementsByName("direction");
  let dir = "";

  for (i = 0; i < radio.length; i++) {
    if (radio[i].checked) {
      dir = radio[i].value;
    }
  }

  //текущий курс
  const arr = JSON.parse(localStorage.getItem(currency));
  const rate = arr[arr.length - 1].value;

  //запрашиваем новый курс
  const URL =
    "http://127.0.0.1:8080/update?updatedBefore=" +
    +new Date(arr[arr.length - 1].date);
  const options = {};
  fetch(URL, options)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("awaiting").classList.add("hidden");
      document.getElementById("main").classList.add("hidden");
      document.getElementById("result").classList.remove("hidden");
      let newrate = data[currency.toUpperCase()];
      let result = "";
      if (
        (newrate > rate && dir == "up") ||
        (newrate < rate && dir == "down")
      ) {
        win(currency, newrate, bet);
      } else if (
        (newrate < rate && dir == "up") ||
        (newrate > rate && dir == "down")
      ) {
        lost(betBTC);
      } else {
        draw();
      }
    });
}

function win(currency, newrate, bet) {
  document.getElementById("resultwin").classList.remove("hidden");
  let balance = +document.getElementById("balance").innerHTML;
  let winBTC = (bet / newrate).toFixed(6);
  document.getElementById("winBTC").innerHTML = winBTC + " BTC";
  document.getElementById("balance").innerHTML = (balance + +winBTC).toFixed(6);
}

function lost(betBTC) {
  document.getElementById("resultlost").classList.remove("hidden");
  let balance = +document.getElementById("balance").innerHTML;
  document.getElementById("balance").innerHTML = (balance - betBTC).toFixed(6);
}

function draw() {
  document.getElementById("resultdraw").classList.remove("hidden");
}

function onSubmit() {
  return false;
}

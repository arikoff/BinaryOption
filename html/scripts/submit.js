function onClick() {
  hideElements();

  //получаем текущие значения для проверки и расчета выигрыша/проигрыша
  //валюта
  const currency = document.getElementById("currSelect").value;
  //размер ставки в валюте
  const bet = +document.getElementById("betbox").value;
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
  const lastDate = arr[arr.length - 1].date;

  //запрашиваем новый курс
  const URL =
    "http://127.0.0.1:8080/update?updatedBefore=" + +new Date(lastDate);
  const options = {};

  id = setInterval(() => {
    fetch(URL, options)
      .then((response) => response.json())
      .then((data) => {
        const arr = JSON.parse(localStorage.getItem("usd"));
        if (data.success == false) {
          clearInterval(id);
          err();
        } else if (data.updatedAt > lastDate) {
          clearInterval(id);
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
        }
      });
  }, 5000);
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
  document.getElementById("draw_text").innerHTML =
    "Курс не изменился. Ставка возвращена.";
}

function err() {
  document.getElementById("resultdraw").classList.remove("hidden");
  document.getElementById("draw_text").innerHTML =
    "На сервере произошла ошибка. Ставка возвращена.";
}

function onSubmit() {
  return false;
}

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

function hideElements() {
  document.getElementById("betbutton").disabled = true;
  document.getElementById("accept").disabled = true;
  document.getElementById("currSelect").disabled = true;
  document.getElementById("betbox").disabled = true;

  document.getElementById("awaiting").classList.remove("hidden");

  const elements = document.getElementsByName("direction");
  for (i = 0; i < elements.length; i++) {
    elements.item(i).disabled = true;
  }
}

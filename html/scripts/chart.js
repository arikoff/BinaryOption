google.charts.load("current", { packages: ["corechart", "bar"] });
google.charts.setOnLoadCallback(changeOption);

function drawChart(currency) {
  var data = new google.visualization.DataTable();
  var maxh;
  var maxm;
  data.addColumn("timeofday", "Time of Day");
  data.addColumn("number", "rate");

  arr = JSON.parse(localStorage.getItem(currency));

  arr.forEach((element) => {
    var gdate = new Date(element.date);
    data.addRow([
      { v: [gdate.getHours(), gdate.getMinutes(), gdate.getSeconds()] },
      element.value,
    ]);
    maxh = gdate.getHours();
    maxm = gdate.getMinutes();
  });

  var options = {
    legend: { position: "none" },
    //title: "EUR / BCC (30 мин)",
    hAxis: {
      title: "",
      format: "HH:mm",
      viewWindow: {
        min: [maxh - 1, maxm],
        max: [maxh, maxm],
      },
      gridlines: { count: 7 },
      showTextEvery: 1,
      minTextSpacing: 1,
    },
    vAxis: {
      title: "",
      gridlines: { count: 5 },
    },
  };

  var chart = new google.visualization.ColumnChart(
    document.getElementById("chart_div")
  );

  chart.draw(data, options);
}


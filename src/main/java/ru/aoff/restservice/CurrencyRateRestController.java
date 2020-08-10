package ru.aoff.restservice;

import java.util.ArrayList;
import java.util.Date;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import ru.aoff.restservice.context.CurrencyRate;
import ru.aoff.restservice.context.CurrencyRates;
import com.google.gson.Gson;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.aoff.restservice.context.currentRatesResponse;

@RestController
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class CurrencyRateRestController {

    private final CurrencyRates currencyRates;

    @SneakyThrows
    @GetMapping("/update")
    public ResponseEntity<String> update() {

        float USD = currencyRates.getUSD().get(currencyRates.getUSD().size() - 1).getValue();
        float EUR = currencyRates.getEUR().get(currencyRates.getEUR().size() - 1).getValue();
        float GBP = currencyRates.getGBP().get(currencyRates.getGBP().size() - 1).getValue();

        Date updatedAt = currencyRates.getUpdatedAt();
        boolean success = currencyRates.isSuccess();

        Gson gson = new Gson();

        return ResponseEntity.ok()
                .header("Access-Control-Allow-Origin", "*")
                .body(gson.toJson(new currentRatesResponse(USD, EUR, GBP, updatedAt, success)));
    }

    @SneakyThrows
    @GetMapping("/initialize")
    public ResponseEntity<String> initialize(@RequestParam String currency) {

        ArrayList<CurrencyRate> currentChart;
        switch (currency.toUpperCase()) {
            case "USD":
                currentChart = currencyRates.getUSD();
                break;
            case "EUR":
                currentChart = currencyRates.getEUR();
                break;
            case "GBP":
                currentChart = currencyRates.getGBP();
                break;
            default:
                currentChart = new ArrayList<>();
                break;
        }

        Gson gson = new Gson();

        if (currentChart.size() > 60) {
            ArrayList<CurrencyRate> reducedChart = new ArrayList<>();
            for (int i = 0; i < 60; i++) {
                reducedChart.add(currentChart.get(currentChart.size()-(60-i)));
            }
            return ResponseEntity.ok()
                    .header("Access-Control-Allow-Origin", "*")
                    .body(gson.toJson(reducedChart));
        } else {
            return ResponseEntity.ok()
                    .header("Access-Control-Allow-Origin", "*")
                    .body(gson.toJson(currentChart));
        }
    }
}
package ru.aoff.restservice;

import java.util.ArrayList;
import java.util.Date;

import lombok.SneakyThrows;
import ru.aoff.restservice.context.CurrencyRate;
import ru.aoff.restservice.context.CurrencyRates;
import com.google.gson.Gson;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.aoff.restservice.context.currentRatesResponse;

@RestController
public class CurrencyRateRestController {

    @SneakyThrows
    @GetMapping("/update")
    public ResponseEntity<String> update(@RequestParam String updatedBefore) {

        CurrencyRates currencyRates = (CurrencyRates) RestServiceApplication.context.getBean("currencyRates");

        Date dateUpdatedBefore = new Date(Long.valueOf(updatedBefore));
        while (dateUpdatedBefore.equals(currencyRates.getUpdatedAt())) {
            Thread.sleep(1000);
        }
        float USD = currencyRates.getUSD().get(currencyRates.getUSD().size() - 1).getValue();
        float EUR = currencyRates.getEUR().get(currencyRates.getEUR().size() - 1).getValue();
        float GBP = currencyRates.getGBP().get(currencyRates.getGBP().size() - 1).getValue();

        Date updatedAt = currencyRates.getUpdatedAt();

        Gson gson = new Gson();

        return ResponseEntity.ok()
                .header("Access-Control-Allow-Origin", "*")
                .body(gson.toJson(new currentRatesResponse(USD, EUR, GBP, updatedAt)));
    }

    @SneakyThrows
    @GetMapping("/initialize")
    public ResponseEntity<String> initialize(@RequestParam String currency) {

        CurrencyRates currencyRates = (CurrencyRates) RestServiceApplication.context.getBean("currencyRates");

        ArrayList<CurrencyRate> currentChart = switch (currency.toUpperCase()) {
            case "USD" -> currencyRates.getUSD();
            case "EUR" -> currencyRates.getEUR();
            case "GBP" -> currencyRates.getGBP();
            default -> new ArrayList<>();
        };

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
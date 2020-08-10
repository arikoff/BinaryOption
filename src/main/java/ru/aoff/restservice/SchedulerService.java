package ru.aoff.restservice;

import com.google.gson.JsonSyntaxException;
import lombok.*;
import org.springframework.web.client.RestClientException;
import ru.aoff.restservice.context.CurrencyRate;
import ru.aoff.restservice.context.CurrencyRates;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class SchedulerService {

    private final String URL = "https://api.coindesk.com/v1/bpi/currentprice.json?t=123454";
    private static final String DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ssX";
    private boolean firstRun = true;

    private final CurrencyRates currencyRates;

    @Scheduled(fixedDelay = 1000)
    public void getNewRates()  {

        Date date = currencyRates.getUpdatedAt();

        getDataFromWebService();

        if (firstRun) {
            currencyRates.addRandomValuesHourBefore(currencyRates);
            firstRun = false;
        }
    }

    private void getDataFromWebService() {

        RestTemplate restTemplate  = new RestTemplate();
        String retData;
        try {
            retData = restTemplate.getForObject(URL, String.class);
        } catch (RestClientException e) {
            e.printStackTrace();
            currencyRates.setSuccess(false);
            return;
        }

        Gson gson = new Gson();
        BCRateResponce bcRateResponce;

        try {
            bcRateResponce = gson.fromJson(retData, BCRateResponce.class);
        } catch (JsonSyntaxException e) {
            e.printStackTrace();
            currencyRates.setSuccess(false);
            return;
        }

        DateFormat iso = new SimpleDateFormat(DATE_FORMAT);
        Date date;

        try {
            date = iso.parse(bcRateResponce.time.updatedISO);
        } catch (ParseException e) {
            e.printStackTrace();
            currencyRates.setSuccess(false);
            return;
        }

        if (!date.equals(currencyRates.getUpdatedAt())) {

            currencyRates.getUSD().add(new CurrencyRate(date, bcRateResponce.bpi.USD.rate_float));
            currencyRates.getEUR().add(new CurrencyRate(date, bcRateResponce.bpi.EUR.rate_float));
            currencyRates.getGBP().add(new CurrencyRate(date, bcRateResponce.bpi.GBP.rate_float));
            currencyRates.setUpdatedAt(date);
            currencyRates.setSuccess(true);

            System.out.println("updated at " + date.toString() + "/" + new Date().toString());
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Getter
    @Setter
    @ToString
    private class BCRateResponce {
        private BCTime time;
        private String chartName;
        private BPI bpi;
    }

    @Getter
    @Setter
    @ToString
    private class BCTime {
        private String updatedISO;
    }

    @Getter
    @Setter
    @ToString
    private class BPI {
        private Rate USD;
        private Rate GBP;
        private Rate EUR;
    }

    @Getter
    @Setter
    @ToString
    private class Rate {
        private String code;
        private float rate_float;
    }

}
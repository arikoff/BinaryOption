package ru.aoff.restservice.context;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Random;

@Component
@Getter
@Setter
public class CurrencyRates {

    private final ArrayList<CurrencyRate> USD = new ArrayList<>();
    private final ArrayList<CurrencyRate> EUR = new ArrayList<>();
    private final ArrayList<CurrencyRate> GBP = new ArrayList<>();
    private Date updatedAt = new Date(0L);
    private boolean success;

    public void addRandomValuesHourBefore(CurrencyRates cr) {

        if (cr.getUSD().size() == 0){
            return;
        }

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(updatedAt);

        Random random = new Random();

        for (int i = 0; i < 60; i++) {

            calendar.add(Calendar.MINUTE, -1);

            float diff = random.nextFloat() * 2;
            cr.getUSD().add(0, new CurrencyRate(calendar.getTime(), cr.USD.get(0).getValue() + 1 - diff));
            diff = random.nextFloat() * 2;
            cr.getEUR().add(0, new CurrencyRate(calendar.getTime(), cr.EUR.get(0).getValue() + 1 - diff));
            diff = random.nextFloat() * 2;
            cr.getGBP().add(0, new CurrencyRate(calendar.getTime(), cr.GBP.get(0).getValue() + 1 - diff));

        }

    }

}

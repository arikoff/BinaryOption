package ru.aoff.restservice.context;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Date;

@Getter
@AllArgsConstructor
public class CurrencyRate {
    private Date date;
    private float value;
}

package ru.aoff.restservice.context;

import lombok.AllArgsConstructor;

import java.util.Date;

@AllArgsConstructor
public class currentRatesResponse {
    private final float USD;
    private final float EUR;
    private final float GBP;
    private final Date updatedAt;
}

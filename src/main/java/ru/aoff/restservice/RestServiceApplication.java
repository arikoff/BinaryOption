package ru.aoff.restservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class RestServiceApplication {

    public static final AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext("ru.aoff.restservice.context");

    public static void main(String[] args) {
        SpringApplication.run(RestServiceApplication.class, args);
    }

}

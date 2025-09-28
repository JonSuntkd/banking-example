package com.banking.client;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Main class for Banking Client Application
 * Spring Boot application with hexagonal architecture
 */
@SpringBootApplication
@EnableTransactionManagement
public class BankingClientApplication {

    public static void main(String[] args) {
        SpringApplication.run(BankingClientApplication.class, args);
    }
}
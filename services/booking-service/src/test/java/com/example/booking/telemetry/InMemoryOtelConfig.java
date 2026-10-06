package com.example.booking.telemetry;

import io.opentelemetry.sdk.testing.exporter.InMemorySpanExporter;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

@TestConfiguration
public class InMemoryOtelConfig {

    @Bean
    @Primary
    public InMemorySpanExporter inMemorySpanExporter() {
        return InMemorySpanExporter.create();
    }
}

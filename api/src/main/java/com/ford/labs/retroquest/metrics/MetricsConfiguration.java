package com.ford.labs.retroquest.metrics;

import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

@Configuration
public class MetricsConfiguration {
    private final Metrics metrics;
    private final MeterRegistry meterRegistry;

    public MetricsConfiguration(Metrics metrics, MeterRegistry meterRegistry) {
        this.metrics = metrics;
        this.meterRegistry = meterRegistry;
    }

    @PostConstruct
    void registerMetrics() {
        Gauge.builder("retroquest.teams.count", this.metrics, Metrics::getTeamCount)
            .strongReference(true)
            .register(this.meterRegistry);

        Gauge.builder("retroquest.feedback.count", this.metrics, Metrics::getFeedbackCount)
            .strongReference(true)
            .register(this.meterRegistry);

        Gauge.builder("retroquest.feedback.averageRating", this.metrics, Metrics::getAverageRating)
            .strongReference(true)
            .register(this.meterRegistry);
    }
}

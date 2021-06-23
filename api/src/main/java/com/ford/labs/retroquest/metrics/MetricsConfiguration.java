/*
 * Copyright (c) 2021 Ford Motor Company
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

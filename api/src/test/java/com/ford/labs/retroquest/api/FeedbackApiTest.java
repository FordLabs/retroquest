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

package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.api.setup.ApiTestBase;
import com.ford.labs.retroquest.feedback.Feedback;
import com.ford.labs.retroquest.feedback.FeedbackDto;
import com.ford.labs.retroquest.feedback.FeedbackRepository;
import io.micrometer.core.instrument.MeterRegistry;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("api")
class FeedbackApiTest extends ApiTestBase {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private MeterRegistry meterRegistry;

    @AfterEach
    void tearDown() {
        feedbackRepository.deleteAllInBatch();
        assertThat(feedbackRepository.count()).isZero();
    }

    @Test
    void shouldPostFeedbackAndUpdateMetrics() throws Exception {
        meterRegistry.gauge("retroquest.feedback.count", 0);
        meterRegistry.gauge("retroquest.feedback.averageRating", 0);

        var feedback = new FeedbackDto(
            4,
            "This is a comment",
            "email@email.email",
            "teamId"
        );

        mockMvc.perform(
            post("/api/feedback/")
                .content(objectMapper.writeValueAsString(feedback))
                .contentType(APPLICATION_JSON)
        )
            .andExpect(status().isCreated())
            .andReturn();

        assertThat(meterRegistry.get("retroquest.feedback.count").gauge().value())
            .isEqualTo(1);
        assertThat(meterRegistry.get("retroquest.feedback.averageRating").gauge().value())
            .isEqualTo(4);
    }
}

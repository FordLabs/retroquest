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

package com.ford.labs.retroquest.feedback;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.net.URISyntaxException;

@RestController
@RequestMapping("/api/feedback")
@Tag(name = "Feedback Controller", description = "The controller that manages feedback for Retroquest")
public class FeedbackController {
    private static final Logger log = LoggerFactory.getLogger(FeedbackController.class);

    private final FeedbackRepository feedbackRepository;

    public FeedbackController(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @PostMapping
    @Operation(summary = "Creates a feedback entry", description = "saveFeedback")
    @ApiResponses(value = {@ApiResponse(responseCode = "201", description = "Created")})
    public ResponseEntity<URI> saveFeedback(@RequestBody FeedbackDto feedbackDto) throws URISyntaxException {
        var feedback = Feedback.fromDto(feedbackDto);
        if (log.isInfoEnabled()) {
            log.info(
                "[FEEDBACK_SUBMITTED] stars:'{}' comment:'{}' email:'{}' teamId:'{}'",
                feedback.getStars(),
                feedback.getComment().replaceAll("\\R", " "),
                feedback.getUserEmail(),
                feedback.getTeamId()
            );
        }
        feedback = feedbackRepository.save(feedback);
        return ResponseEntity.created(new URI("/api/feedback/" + feedback.getId())).build();
    }
}

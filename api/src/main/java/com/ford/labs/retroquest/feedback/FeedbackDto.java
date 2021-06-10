package com.ford.labs.retroquest.feedback;

import lombok.Value;

@Value
public class FeedbackDto {
    int stars;
    String comment;
    String userEmail;
    String teamId;
}

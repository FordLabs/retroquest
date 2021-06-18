package com.ford.labs.retroquest.actionitem;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Value;

@Value
@JsonIgnoreProperties(ignoreUnknown = true)
public class UpdateActionItemTaskRequest {
    String task;
}

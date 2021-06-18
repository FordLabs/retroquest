package com.ford.labs.retroquest.columntitle;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Value;

@Value
@JsonIgnoreProperties(ignoreUnknown = true)
public class UpdateColumnTitleRequest {
    String title;
}

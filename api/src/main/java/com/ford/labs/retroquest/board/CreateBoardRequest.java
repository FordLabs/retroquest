package com.ford.labs.retroquest.board;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ford.labs.retroquest.thought.CreateThoughtRequest;
import lombok.Value;

import java.util.List;

@Value
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateBoardRequest {
    String teamId;
    List<CreateThoughtRequest> thoughts;
}

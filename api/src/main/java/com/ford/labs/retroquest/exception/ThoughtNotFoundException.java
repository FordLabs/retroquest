package com.ford.labs.retroquest.exception;

import lombok.Getter;

@Getter
public class ThoughtNotFoundException extends RuntimeException {
    private final String message;

    public ThoughtNotFoundException(String thoughtId) {
        this.message = String.join(" ",
                "Thought with ID", thoughtId, "could not be found");
    }
}

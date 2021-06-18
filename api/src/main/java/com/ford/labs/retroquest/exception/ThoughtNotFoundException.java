package com.ford.labs.retroquest.exception;

import lombok.Getter;

@Getter
public class ThoughtNotFoundException extends RuntimeException {
    private final String message;

    public ThoughtNotFoundException(Long thoughtId) {
        this.message = String.format("Thought with ID [%d] could not be found", thoughtId);
    }

    public ThoughtNotFoundException(String thoughtId) {
        this(Long.valueOf(thoughtId));
    }
}

package com.ford.labs.retroquest.e2e;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Tag("container")
public class ContextLoadsContainerTest {

    @Test
    public void contextLoads() {
        assertThat(true).isTrue();
    }
}

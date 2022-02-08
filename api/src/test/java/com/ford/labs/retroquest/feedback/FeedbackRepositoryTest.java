package com.ford.labs.retroquest.feedback;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class FeedbackRepositoryTest {
    @Autowired
    private FeedbackRepository subject;

    @Autowired
    private TestEntityManager entityManager;

    private final LocalDateTime yesterday = LocalDateTime.now().minus(1, ChronoUnit.DAYS);
    private final LocalDateTime tomorrow = LocalDateTime.now().plus(1, ChronoUnit.DAYS);

    @Test
    void getAverageRating_returnsZeroIfNoRatings() {
        assertThat(subject.getAverageRating(yesterday, tomorrow)).isEqualTo(0.0);
    }

    @Test
    public void getAverageRating_returnsAverageOfRatingsInTimeFrame() {
        entityManager.persist(Feedback.builder().stars(2).dateCreated(LocalDateTime.now()).build());
        entityManager.persist(Feedback.builder().stars(4).dateCreated(LocalDateTime.now()).build());
        assertThat(subject.getAverageRating(yesterday, tomorrow)).isEqualTo(3.0);
    }
}
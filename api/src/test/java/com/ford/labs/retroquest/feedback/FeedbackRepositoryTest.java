package com.ford.labs.retroquest.feedback;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class FeedbackRepositoryTest {
    @Autowired
    private FeedbackRepository subject;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    void getAverageRating_returnsZeroIfNoRatings() {
        assertThat(subject.getAverageRating()).isEqualTo(0.0);
    }

    @Test
    public void getAverageRating_returnsAverageOfRatingsInTimeFrame() {
        entityManager.persist(Feedback.builder().stars(2).build());
        entityManager.persist(Feedback.builder().stars(4).build());
        assertThat(subject.getAverageRating()).isEqualTo(3.0);
    }
}
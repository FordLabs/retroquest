/*
 * Copyright (c) 2022 Ford Motor Company
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
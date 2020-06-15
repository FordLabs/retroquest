/*
 * Copyright © 2018 Ford Motor Company
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

package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.feedback.Feedback;
import com.ford.labs.retroquest.feedback.FeedbackRepository;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.management.MBeanServer;
import javax.management.ObjectName;
import java.util.Arrays;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = "spring.jmx.enabled=true")
public class MetricsJMXTest {

    @Autowired
    private MBeanServer mBeanServer;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @AfterEach
    public void teardown() {
        teamRepository.deleteAllInBatch();
        feedbackRepository.deleteAllInBatch();

        assertThat(teamRepository.count()).isEqualTo(0);
        assertThat(feedbackRepository.count()).isEqualTo(0);
    }

    @Test
    public void should_return_total_count_of_all_teams() throws Exception {
        teamRepository.save(Team.builder().uri("uri").build());

        Integer teamCount = (Integer) mBeanServer.getAttribute(ObjectName.getInstance("com.ford.labs.retroquest.metrics:name=metrics,type=Metrics"), "TeamCount");
        assertThat(teamCount).isEqualTo(1);
    }

    @Test
    public void should_return_total_count_of_feedback() throws Exception {
        feedbackRepository.save(Feedback.builder().build());

        Integer feedbackCount = (Integer) mBeanServer.getAttribute(ObjectName.getInstance("com.ford.labs.retroquest.metrics:name=metrics,type=Metrics"), "FeedbackCount");
        assertThat(feedbackCount).isEqualTo(1);
    }

    @Test
    public void should_return_average_of_all_feedback_ratings() throws Exception {
        feedbackRepository.saveAll(Arrays.asList(
                Feedback.builder().stars(5).build(),
                Feedback.builder().stars(1).build()
        ));

        Double feedbackCount = (Double) mBeanServer.getAttribute(ObjectName.getInstance("com.ford.labs.retroquest.metrics:name=metrics,type=Metrics"), "AverageRating");
        assertThat(feedbackCount).isEqualTo(3.0);
    }

    @Test
    public void _should_return_average_of_all_feedback_ratings_ignoring_zeros() throws Exception {
        feedbackRepository.saveAll(Arrays.asList(
                Feedback.builder().stars(5).build(),
                Feedback.builder().stars(2).build(),
                Feedback.builder().stars(0).build()
        ));

        Double feedbackCount = (Double) mBeanServer.getAttribute(ObjectName.getInstance("com.ford.labs.retroquest.metrics:name=metrics,type=Metrics"), "AverageRating");
        assertThat(feedbackCount).isEqualTo(3.5);
    }
}

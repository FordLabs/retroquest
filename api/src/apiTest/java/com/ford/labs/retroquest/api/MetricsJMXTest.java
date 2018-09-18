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
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.management.*;
import java.util.Arrays;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest(properties = "spring.jmx.enabled=true")
public class MetricsJMXTest {

    @Autowired
    private MBeanServer mBeanServer;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Test
    public void canGetFeedbackCount() throws MalformedObjectNameException, AttributeNotFoundException, MBeanException, ReflectionException, InstanceNotFoundException {
        feedbackRepository.save(new Feedback());

        Object feedbackCount = mBeanServer.getAttribute(ObjectName.getInstance("com.ford.labs.retroquest.metrics:name=metrics,type=Metrics"), "FeedbackCount");
        assertEquals(1, feedbackCount);
    }

    @Test
    public void canGetAverageRating() throws MalformedObjectNameException, AttributeNotFoundException, MBeanException, ReflectionException, InstanceNotFoundException {
        Feedback feedback = new Feedback();
        feedback.setStars(5);
        feedbackRepository.save(feedback);

        Object feedbackCount = mBeanServer.getAttribute(ObjectName.getInstance("com.ford.labs.retroquest.metrics:name=metrics,type=Metrics"), "AverageRating");
        assertEquals(5.0, feedbackCount);
    }

    @Test
    public void averageRatingIgnoresStarsWithAZeroValue() throws MalformedObjectNameException, AttributeNotFoundException, MBeanException, ReflectionException, InstanceNotFoundException {
        Feedback fiveStarFeedback = new Feedback();
        fiveStarFeedback.setStars(5);
        Feedback zeroStarFeedback = new Feedback();
        zeroStarFeedback.setStars(0);
        feedbackRepository.save(Arrays.asList(fiveStarFeedback, zeroStarFeedback));

        Object feedbackCount = mBeanServer.getAttribute(ObjectName.getInstance("com.ford.labs.retroquest.metrics:name=metrics,type=Metrics"), "AverageRating");
        assertEquals(5.0, feedbackCount);
    }

    @After
    public void cleanUpTestData() {
        teamRepository.deleteAll();
        feedbackRepository.deleteAll();
    }
}

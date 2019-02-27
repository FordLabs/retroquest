package com.ford.labs.retroquest.actionitem;

import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.thought.ThoughtRepository;
import org.assertj.core.api.Assertions;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Set;

@RunWith(SpringRunner.class)
@DataJpaTest
public class ActionItemRepositoryTest {

    @Autowired
    private ActionItemRepository actionItemRepository;

    @Autowired
    private ThoughtRepository thoughtRepository;

    @After
    public void tearDown() {
        thoughtRepository.deleteAll();
        actionItemRepository.deleteAll();

        Assertions.assertThat(thoughtRepository.count())
                .isEqualTo(0);
        Assertions.assertThat(actionItemRepository.count())
                .isEqualTo(0);
    }

    @Test
    public void shouldReturnAListOfLinkedThoughts() {
        Thought thought = new Thought();
        thought.setMessage("some message");
        thought.setTeamId("team1");

        actionItemRepository.save(
                new ActionItem(null, "some message", false, "team1", null, null, thought)
        );

        Set<Thought> linkedThoughts = actionItemRepository.findAll()
                .get(0)
                .getLinkedThoughts();

        Assertions.assertThat(linkedThoughts)
                .containsExactly(thought);
    }

    @Test
    public void shouldReturnAnEmptyListOfLinkedThoughtsIfNoneAreLinked() {
        actionItemRepository.save(
                new ActionItem(null, "some message", false, "team1", null, null)
        );

        Set<Thought> linkedThoughts = actionItemRepository.findAll()
                .get(0)
                .getLinkedThoughts();

        Assertions.assertThat(linkedThoughts).isEmpty();
    }
}

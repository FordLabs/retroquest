package com.ford.labs.retroquest.thought;

import com.ford.labs.retroquest.columntitle.ColumnTitle;
import com.ford.labs.retroquest.columntitle.ColumnTitleRepository;
import com.ford.labs.retroquest.exception.ThoughtNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.atMostOnce;
import static org.mockito.Mockito.never;

@ExtendWith(MockitoExtension.class)
class ThoughtServiceTest {

    @Mock
    private ThoughtRepository thoughtRepository;

    @Mock
    private ColumnTitleRepository columnTitleRepository;

    private ThoughtService thoughtService;
    private final String thoughtId = "1";
    private final String teamId = "1";

    @BeforeEach
    void setup() {
            this.thoughtService = new ThoughtService(this.thoughtRepository, this.columnTitleRepository);
    }

    @Test
    void likeThoughtShouldIncrementNumberOfLikesByOne() {
        Thought thought = Thought.builder().hearts(5).build();

        given(this.thoughtRepository.findById(Long.valueOf(thoughtId))).willReturn(Optional.ofNullable(thought));
        given(thoughtRepository.save(thought)).willReturn(thought);

        assertThat(this.thoughtService.likeThought(thoughtId)).isEqualTo(6);
        then(thoughtRepository).should(atMostOnce()).save(thought);
    }

    @Test
    void whenLikingThoughtWhichDoesntHaveAValidIDThrowsThoughtNotFoundException() {
        Thought thought = Thought.builder().hearts(5).build();

        given(this.thoughtRepository.findById(Long.valueOf(thoughtId))).willThrow(new ThoughtNotFoundException(thoughtId));

        ThoughtNotFoundException actualException = assertThrows(ThoughtNotFoundException.class, () -> thoughtService.likeThought(thoughtId));
        assertThat(actualException.getMessage()).contains(thoughtId);
        then(thoughtRepository).should(never()).save(thought);
    }

    @Test
    void whenDiscussingThoughtNotDiscussedThoughtIsSetToTrue() {
        Thought thought = Thought.builder().discussed(false).build();

        given(this.thoughtRepository.findById(Long.valueOf(thoughtId))).willReturn(Optional.ofNullable(thought));
        thoughtService.discussThought(thoughtId);
        assertThat(Objects.requireNonNull(thought).isDiscussed()).isTrue();
        then(thoughtRepository).should().save(thought);
    }

    @Test
    void whenDiscussingThoughtPreviouslyDiscussedThoughtIsSetToFalse() {
        Thought thought = Thought.builder().discussed(true).build();

        given(this.thoughtRepository.findById(Long.valueOf(thoughtId))).willReturn(Optional.ofNullable(thought));
        thoughtService.discussThought(thoughtId);
        assertThat(Objects.requireNonNull(thought).isDiscussed()).isFalse();
        then(thoughtRepository).should().save(thought);
    }

    @Test
    void whenThoughtMessageIsUpdatedThoughtIsUpdated() {
        Thought thought = Thought.builder().discussed(true).build();
        String updatedMessage = "update message hello";

        given(this.thoughtRepository.findById(Long.valueOf(thoughtId))).willReturn(Optional.ofNullable(thought));
        thoughtService.updateThoughtMessage(thoughtId, updatedMessage);
        assertThat(Objects.requireNonNull(thought).getMessage()).isEqualTo(updatedMessage);
        then(thoughtRepository).should().save(thought);
    }

    @Test
    void whenGettingThoughtsForTeamThoughtsAreRetrieved() {
        Thought thought = Thought.builder().discussed(true).build();
        List<Thought> listOfThoughts = new ArrayList<>();
        listOfThoughts.add(thought);
        given(this.thoughtRepository.findAllByTeamIdAndBoardIdIsNull(teamId)).willReturn(listOfThoughts);
        thoughtService.fetchAllThoughtsByTeam(teamId);
        then(thoughtRepository).should().findAllByTeamIdAndBoardIdIsNull(teamId);
    }

    @Test
    void whenDeletingThoughtsByTeamIdAllThoughtsAreDeleted() {
        thoughtService.deleteAllThoughtsByTeamId(teamId);
        then(thoughtRepository).should().deleteAllByTeamId(teamId);
    }

    @Test
    void whenDeletingThoughtsByTeamIdAndThoughtIdThoughtIsDeleted() {
        thoughtService.deleteThought(teamId, Long.valueOf(thoughtId));
        then(thoughtRepository).should().deleteThoughtByTeamIdAndId(teamId, Long.valueOf(thoughtId));
    }

    @Test
    void whenCreatingThoughtColumnTitleWillGetSetAndThoughtWillBeSaved() {
        var topic = "topic";
        var columnTitle = ColumnTitle.builder().title("Happy").build();
        var request = new CreateThoughtRequest(
            null,
            0,
            topic,
            false,
            teamId,
            null
        );
        given(columnTitleRepository.findByTeamIdAndAndTopic(teamId, topic)).willReturn(columnTitle);
        given(thoughtRepository.save(any(Thought.class))).willAnswer(a -> {
            var thought = a.<Thought>getArgument(0);
            thought.setId(1234L);
            return thought;
        });

        var thought = thoughtService.createThought(teamId, request);

        assertThat(thought.getColumnTitle()).isEqualTo(columnTitle);
        then(columnTitleRepository).should().findByTeamIdAndAndTopic(teamId, thought.getTopic());
        then(thoughtRepository).should().save(thought);
    }

}

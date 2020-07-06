package com.ford.labs.retroquest;

import com.ford.labs.retroquest.board.Board;
import com.ford.labs.retroquest.board.BoardRepository;
import com.ford.labs.retroquest.feedback.Feedback;
import com.ford.labs.retroquest.feedback.FeedbackRepository;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamRepository;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.annotation.PostConstruct;
import java.util.List;

@Configuration
@Profile("datemigration")
public class DateMigrationConfiguration {
    final FeedbackRepository feedbackRepository;
    final TeamRepository teamRepository;
    final BoardRepository boardRepository;

    public DateMigrationConfiguration(FeedbackRepository feedbackRepository, TeamRepository teamRepository, BoardRepository boardRepository) {
        this.feedbackRepository = feedbackRepository;
        this.teamRepository = teamRepository;
        this.boardRepository = boardRepository;
    }

    @PostConstruct
    public void onAppStartup() {
        List<Feedback> feedbacks = feedbackRepository.findAll();
        feedbacks.forEach(feedback -> {
            feedback.setDateCreated2(feedback.getDateCreated());
            feedbackRepository.save(feedback);
        });

        List<Board> boards = boardRepository.findAll();
        boards.forEach(board -> {
            board.setDateCreated2(board.getDateCreated());
            boardRepository.save(board);
        });

        List<Team> teams = teamRepository.findAll();
        teams.forEach(team -> {
            team.setDateCreated2(team.getDateCreated());
            team.setLastLoginDate2(team.getLastLoginDate());
            teamRepository.save(team);
        });
    }
}

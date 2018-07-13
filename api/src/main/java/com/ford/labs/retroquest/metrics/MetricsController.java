package com.ford.labs.retroquest.metrics;

import com.ford.labs.retroquest.team.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/metrics")
public class MetricsController {

    @Autowired
    private TeamRepository teamRepository;

    @GetMapping("/team/count")
    public int getTeamCount() {
        return teamRepository.findAll().size();
    }
}

package com.ford.labs.retroquest.team;

import com.ford.labs.retroquest.exception.BoardDoesNotExistException;
import com.ford.labs.retroquest.team.validation.CaptchaProperties;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CaptchaService {
    private TeamRepository teamRepository;
    private CaptchaProperties captchaProperties;

    public CaptchaService(TeamRepository teamRepository, CaptchaProperties captchaProperties) {
        this.teamRepository = teamRepository;
        this.captchaProperties = captchaProperties;
    }

    public boolean isCaptchaEnabledForTeam(String teamName) {
        if(!isCaptchaEnabled()) {
            return false;
        }

        Optional<Team> team = teamRepository.findTeamByName(teamName);
        if(team.isPresent()) {
            Integer failedAttempts = team.get().getFailedAttempts() != null ? team.get().getFailedAttempts() : 0;
            return failedAttempts > captchaProperties.getFailedLoginThreshold();
        }
        throw new BoardDoesNotExistException();
    }

    public boolean isCaptchaEnabled() {
        return captchaProperties.isEnabled();
    }
}
